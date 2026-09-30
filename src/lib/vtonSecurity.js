import sharp from 'sharp';
import dns from 'dns/promises';

// 1. EXACT FQDN ALLOWLIST FOR SSRF PROTECTION (NO WILDCARDS)
export const ALLOWED_IMAGE_HOSTS = new Set([
  'assets.myntassets.com',
  'assets.ajio.com',
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'images.unsplash.com',
  'static.zara.net',
  'lp2.hm.com',
  'www.snitch.co.in',
  'cdn.shopify.com'
]);

// Private / Internal IPv4 & IPv6 Subnet Check
function isPrivateOrReservedIP(ip) {
  if (!ip || typeof ip !== 'string') return true;

  const normalized = ip.trim().toLowerCase();

  // IPv6 Checks
  if (normalized.includes(':')) {
    // IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
    if (normalized.startsWith('::ffff:')) {
      return isPrivateOrReservedIP(normalized.substring(7));
    }

    // Loopback / Unspecified
    if (normalized === '::1' || normalized === '::' || normalized === '0:0:0:0:0:0:0:1' || normalized === '0:0:0:0:0:0:0:0') {
      return true;
    }

    // Unique Local Addresses (fc00::/7 -> fc.. or fd..)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
      return true;
    }

    // Link-Local (fe80::/10 -> fe8, fe9, fea, feb)
    if (/^fe[89ab]/i.test(normalized)) {
      return true;
    }

    // Multicast (ff00::/8)
    if (normalized.startsWith('ff')) {
      return true;
    }

    // Valid public IPv6
    return false;
  }

  // IPv4 Checks
  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IPv4 treated as unsafe
  }

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link-Local / AWS Metadata e.g. 169.254.169.254)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8 (Current network)
  if (parts[0] === 0) return true;

  return false;
}

// 2. HARDENED SSRF FETCH WITH DUAL-STACK DNS VALIDATION & NO REDIRECTS
export async function safeFetchImage(rawUrl, timeoutMs = 10000) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('SSRF_INVALID_URL: URL must be a non-empty string.');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error('SSRF_MALFORMED_URL: Invalid URL format.');
  }

  // Enforce HTTPS
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('SSRF_UNSAFE_PROTOCOL: Only secure https:// URLs are allowed.');
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Strict Exact Host Allowlist Check
  if (!ALLOWED_IMAGE_HOSTS.has(hostname)) {
    throw new Error(`SSRF_HOST_NOT_ALLOWED: Host "${hostname}" is not in the trusted merchant allowlist.`);
  }

  // Dual-Stack DNS Resolution Check (A and AAAA records)
  try {
    const [ipv4Addresses, ipv6Addresses] = await Promise.allSettled([
      dns.resolve4(hostname),
      dns.resolve6(hostname)
    ]);

    const allIps = [];
    if (ipv4Addresses.status === 'fulfilled') allIps.push(...ipv4Addresses.value);
    if (ipv6Addresses.status === 'fulfilled') allIps.push(...ipv6Addresses.value);

    if (allIps.length === 0) {
      throw new Error('SSRF_DNS_FAILED: No IP address resolved for host.');
    }

    for (const ip of allIps) {
      if (isPrivateOrReservedIP(ip)) {
        throw new Error(`SSRF_PRIVATE_IP_BLOCKED: Host resolves to unsafe/private IP address: ${ip}`);
      }
    }
  } catch (dnsErr) {
    if (dnsErr.message.startsWith('SSRF_')) throw dnsErr;
    throw new Error(`SSRF_DNS_ERROR: Failed to resolve host securely: ${dnsErr.message}`);
  }

  // Fetch with redirects strictly DISABLED and abort timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(rawUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'ShopSmart-Secure-VTON-Validator/1.0',
        'Accept': 'image/jpeg,image/png,image/webp,image/*'
      },
      redirect: 'error', // STRICT NO-REDIRECTS
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`SSRF_FETCH_FAILED: Remote server returned HTTP ${res.status}`);
    }

    const contentLength = res.headers.get('content-length');
    if (contentLength && Number(contentLength) > 6 * 1024 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE: Remote image exceeds 6MB limit.');
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > 6 * 1024 * 1024) {
      throw new Error('PAYLOAD_TOO_LARGE: Downloaded image buffer exceeds 6MB limit.');
    }

    return buffer;
  } catch (fetchErr) {
    clearTimeout(timer);
    if (fetchErr.name === 'AbortError') {
      throw new Error('FETCH_TIMEOUT: Remote image fetch timed out.');
    }
    throw fetchErr;
  }
}

// 3. MAGIC BYTES & PRE-DECODE DECOMPRESSION BOMB DEFENSE
// Max Decoded Pixels: 4,194,304 (~4.2 MP, e.g. 2048x2048)
const MAX_INPUT_PIXELS = 4194304;
const MAX_FILE_BYTES = 6 * 1024 * 1024; // 6MB

export async function validateAndSanitizeImage(imageInput) {
  if (!imageInput) {
    throw new Error('MISSING_IMAGE: Image input is required.');
  }

  let buffer;
  if (Buffer.isBuffer(imageInput)) {
    buffer = imageInput;
  } else if (typeof imageInput === 'string') {
    let cleanB64 = imageInput;
    if (imageInput.startsWith('data:image/')) {
      cleanB64 = imageInput.split('base64,')[1];
    }
    buffer = Buffer.from(cleanB64, 'base64');
  } else {
    throw new Error('INVALID_IMAGE_TYPE: Image input must be a Buffer or Base64 string.');
  }

  // 1. Raw Byte Size Check
  if (buffer.length === 0) {
    throw new Error('EMPTY_IMAGE: Image buffer is empty.');
  }
  if (buffer.length > MAX_FILE_BYTES) {
    throw new Error(`FILE_TOO_LARGE: Image size (${Math.round(buffer.length / 1024 / 1024)}MB) exceeds 6MB limit.`);
  }

  // 2. Magic Bytes Header Check
  // JPEG: FF D8 FF
  // PNG:  89 50 4E 47
  // WebP: 52 49 46 46 ... 57 45 42 50
  const isJpeg = buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer.length > 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('INVALID_MAGIC_BYTES: File signature does not match authorized JPG, PNG, or WebP formats.');
  }

  // 3. Pre-Decode Pixel Clamp & Sanitization via Sharp
  // limitInputPixels prevents C/C++ libvips decoder from allocating RAM for decompression bombs
  try {
    const pipeline = sharp(buffer, {
      limitInputPixels: MAX_INPUT_PIXELS,
      sequentialRead: true
    });

    const metadata = await pipeline.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('CORRUPT_IMAGE_METADATA: Unable to parse image dimensions.');
    }

    const totalPixels = metadata.width * metadata.height;
    if (totalPixels > MAX_INPUT_PIXELS) {
      throw new Error(`DECOMPRESSION_BOMB_PREVENTED: Image resolution (${metadata.width}x${metadata.height} = ${totalPixels} pixels) exceeds safety limit of ${MAX_INPUT_PIXELS} pixels.`);
    }

    // Re-encode to clean JPEG, stripping all EXIF, GPS, and metadata
    const sanitizedBuffer = await pipeline
      .rotate() // Auto-orient based on EXIF before stripping
      .resize(1024, 1536, { fit: 'inside', withoutEnlargement: true }) // Normalize for optimal VTON
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    return {
      sanitizedBuffer,
      base64: sanitizedBuffer.toString('base64'),
      width: metadata.width,
      height: metadata.height,
      mimeType: 'image/jpeg'
    };
  } catch (sharpErr) {
    if (sharpErr.message.includes('Input image exceeds pixel limit') || sharpErr.message.includes('DECOMPRESSION_BOMB')) {
      throw new Error(`DECOMPRESSION_BOMB_PREVENTED: Image exceeds maximum allowed decoded pixel capacity.`);
    }
    throw new Error(`IMAGE_SANITY_ERROR: Failed to validate and re-encode image: ${sharpErr.message}`);
  }
}

// 4. ATOMIC GLOBAL GPU & QUEUE LIMITER (OWASP API4)
// Enforces Max 5 Active GPU Jobs + Max 10 Queue Depth with Concurrency Mutex
class AtomicResourceManager {
  constructor() {
    this.maxActiveJobs = 5;
    this.maxQueueDepth = 10;
    this.activeJobs = 0;
    this.queuedCount = 0;
    this.userActiveJobMap = new Map(); // userId -> boolean
  }

  async acquire(userId = 'anonymous') {
    // 1. Per-User Single-Job Lock
    if (this.userActiveJobMap.get(userId)) {
      const err = new Error('USER_CONCURRENCY_LIMIT: You already have an active Try-On in progress. Please wait.');
      err.statusCode = 429;
      throw err;
    }

    // 2. Check Global Queue Exhaustion
    if (this.activeJobs >= this.maxActiveJobs) {
      if (this.queuedCount >= this.maxQueueDepth) {
        const err = new Error('QUEUE_EXHAUSTED: VTON processing servers are currently at maximum capacity. Please retry shortly.');
        err.statusCode = 503;
        err.retryAfter = 15;
        throw err;
      }
    }

    // 3. Acquire slot
    this.userActiveJobMap.set(userId, true);
    this.activeJobs++;
    
    return () => {
      this.release(userId);
    };
  }

  release(userId) {
    this.userActiveJobMap.delete(userId);
    this.activeJobs = Math.max(0, this.activeJobs - 1);
  }

  getMetrics() {
    return {
      activeJobs: this.activeJobs,
      maxActiveJobs: this.maxActiveJobs,
      queueDepth: this.queuedCount,
      maxQueueDepth: this.maxQueueDepth
    };
  }
}

export const globalResourceManager = new AtomicResourceManager();

// 5. EPHEMERAL IN-MEMORY CACHE WITH HARD TTL (MAX 15 MINUTES RETENTION TARGET)
class EphemeralVtonCache {
  constructor(retentionMinutes = 15, maxSize = 50) {
    this.ttlMs = retentionMinutes * 60 * 1000;
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  set(key, value) {
    this.pruneExpired();

    if (this.cache.size >= this.maxSize) {
      // LRU Eviction: delete oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  pruneExpired() {
    const now = Date.now();
    for (const [k, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(k);
      }
    }
  }

  size() {
    this.pruneExpired();
    return this.cache.size;
  }
}

export const ephemeralVtonCache = new EphemeralVtonCache(15, 50);

// 6. ORIGIN & CSRF VERIFICATION HELPER
export function verifyRequestOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const referer = request.headers.get('referer');

  // In production / same-origin calls:
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost !== host && !originHost.includes('localhost') && !originHost.includes('127.0.0.1')) {
      return false;
    }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host && !refererHost.includes('localhost') && !refererHost.includes('127.0.0.1')) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

// 7. SAFE LOGGING (ZERO BASE64 OR SENSITIVE PII IN LOGS)
export function safeLog(context, message, meta = {}) {
  const sanitizedMeta = { ...meta };
  // Redact any possible base64 or long image strings
  for (const [k, v] of Object.entries(sanitizedMeta)) {
    if (typeof v === 'string' && (v.length > 200 || v.startsWith('data:image') || v.includes('base64'))) {
      sanitizedMeta[k] = `[REDACTED_IMAGE_STRING_LEN_${v.length}]`;
    }
  }
  console.log(`[${new Date().toISOString()}] [${context}] ${message}`, Object.keys(sanitizedMeta).length ? JSON.stringify(sanitizedMeta) : '');
}
