import { NextResponse } from 'next/server';
import dns from 'dns/promises';
import {
  validateAndSanitizeImage,
  verifyRequestOrigin,
  safeLog
} from '@/lib/vtonSecurity';

const ALLOWED_STORE_HOSTS = new Set([
  'amazon.in',
  'www.amazon.in',
  'amazon.com',
  'www.amazon.com',
  'myntra.com',
  'www.myntra.com',
  'ajio.com',
  'www.ajio.com',
  'snitch.co.in',
  'www.snitch.co.in',
  'zara.com',
  'www.zara.com',
  'hm.com',
  'www.hm.com'
]);

function isPrivateIP(ip) {
  if (!ip) return true;
  const normalized = ip.trim().toLowerCase();
  if (normalized.includes(':')) {
    if (normalized === '::1' || normalized === '::' || normalized.startsWith('fc') || normalized.startsWith('fd') || /^fe[89ab]/i.test(normalized)) {
      return true;
    }
    return false;
  }
  const p = normalized.split('.').map(Number);
  if (p.length !== 4 || p.some(x => isNaN(x) || x < 0 || x > 255)) return true;
  if (p[0] === 127 || p[0] === 10 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 169 && p[1] === 254) || p[0] === 0) {
    return true;
  }
  return false;
}

export async function POST(request) {
  try {
    // 1. Origin & CSRF Guard
    if (!verifyRequestOrigin(request)) {
      safeLog('VTON Extract', 'Blocked unauthorized origin request');
      return NextResponse.json({ success: false, error: "Access denied: Unauthorized cross-origin request." }, { status: 403 });
    }

    const { url, rawImageBase64 } = await request.json();

    // 2. Direct Image / Screenshot Ingestion with Magic Bytes & Pre-Decode Clamp
    if (rawImageBase64 && !url) {
      try {
        const sanitized = await validateAndSanitizeImage(rawImageBase64);
        safeLog('VTON Extract', 'Ingested custom garment image screenshot');
        return NextResponse.json({
          success: true,
          garment: {
            id: `custom-garment-${Date.now()}`,
            title: "Custom Uploaded Garment",
            brand: "User Garment",
            price: "Custom",
            store: "Custom Upload",
            image: `data:${sanitized.mimeType};base64,${sanitized.base64}`,
            direct_link: "#",
            tryon_compatible: true
          }
        });
      } catch (valErr) {
        safeLog('VTON Extract', `Invalid garment image: ${valErr.message}`);
        return NextResponse.json({ success: false, error: valErr.message }, { status: 400 });
      }
    }

    // 3. Multi-Store High-Precision URL Extraction with Hardened SSRF Guard
    if (url && typeof url === 'string') {
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return NextResponse.json({ success: false, error: "Invalid URL format." }, { status: 400 });
      }

      if (parsedUrl.protocol !== 'https:') {
        return NextResponse.json({ success: false, error: "Only secure https:// store URLs are allowed." }, { status: 400 });
      }

      const host = parsedUrl.hostname.toLowerCase();
      const isAllowedHost = ALLOWED_STORE_HOSTS.has(host) || Array.from(ALLOWED_STORE_HOSTS).some(h => host.endsWith('.' + h));

      if (!isAllowedHost) {
        safeLog('VTON Extract SSRF', `Blocked non-whitelisted store URL: ${host}`);
        return NextResponse.json({
          success: false,
          error: "Store not supported or domain not in trusted merchant allowlist. Please use 'Upload Outfit Screenshot' for instant try-on!"
        }, { status: 400 });
      }

      // DNS Validation & Private IP Block
      try {
        const [v4, v6] = await Promise.allSettled([
          dns.resolve4(host),
          dns.resolve6(host)
        ]);

        const ips = [];
        if (v4.status === 'fulfilled') ips.push(...v4.value);
        if (v6.status === 'fulfilled') ips.push(...v6.value);

        for (const ip of ips) {
          if (isPrivateIP(ip)) {
            safeLog('VTON Extract SSRF', `Blocked internal/private IP resolution: ${ip}`);
            return NextResponse.json({ success: false, error: "Access denied to internal network." }, { status: 403 });
          }
        }
      } catch (dnsErr) {
        safeLog('VTON Extract DNS', `DNS resolution error for ${host}: ${dnsErr.message}`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
          },
          redirect: 'error', // STRICT NO-REDIRECTS
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const html = await response.text();

        // 1. Store Name Detection
        let storeName = "Fashion Store";
        if (url.includes("amazon.in") || url.includes("amazon.com")) storeName = "Amazon";
        else if (url.includes("myntra.com")) storeName = "Myntra";
        else if (url.includes("ajio.com")) storeName = "Ajio";
        else if (url.includes("snitch.co.in") || url.includes("snitch.com")) storeName = "Snitch";
        else if (url.includes("zara.com")) storeName = "Zara";
        else if (url.includes("hm.com")) storeName = "H&M";

        // 2. High-Res Image Extraction (Multi-pattern fallback)
        let extractedImage = null;

        // Amazon specific dynamic image & hi-res maps
        if (storeName === "Amazon") {
          const dynamicImgMatch = html.match(/data-a-dynamic-image=["'](\{.+?\})["']/i);
          if (dynamicImgMatch) {
            try {
              const parsedMap = JSON.parse(dynamicImgMatch[1].replace(/&quot;/g, '"'));
              const keys = Object.keys(parsedMap);
              if (keys.length > 0) extractedImage = keys[0];
            } catch (e) {}
          }

          if (!extractedImage) {
            const oldHiresMatch = html.match(/data-old-hires=["'](https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)["']/i);
            if (oldHiresMatch) extractedImage = oldHiresMatch[1];
          }

          if (!extractedImage) {
            const mainImgMatch = html.match(/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)"/i) ||
                                 html.match(/"mainUrl":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)"/i) ||
                                 html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%_-]+\.(?:jpg|png|jpeg)/i);
            if (mainImgMatch) extractedImage = mainImgMatch[1] || mainImgMatch[0];
          }
        }

        // Myntra specific image patterns
        if (!extractedImage && storeName === "Myntra") {
          const myntraMatch = html.match(/https:\/\/assets\.myntassets\.com\/[^\s"']+\.(?:jpg|png|jpeg|webp)/i);
          if (myntraMatch) extractedImage = myntraMatch[0];
        }

        // Ajio specific image patterns
        if (!extractedImage && storeName === "Ajio") {
          const ajioMatch = html.match(/https:\/\/assets\.ajio\.com\/medias\/[^\s"']+\.(?:jpg|png|jpeg|webp)/i);
          if (ajioMatch) extractedImage = ajioMatch[0];
        }

        // Standard OpenGraph Meta Tags
        if (!extractedImage) {
          const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                               html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                               html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                               html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
          if (ogImageMatch) extractedImage = ogImageMatch[1];
        }

        // 3. Title Extraction
        const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ||
                             html.match(/<title>([^<]+)<\/title>/i);
        let rawTitle = ogTitleMatch ? ogTitleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : `${storeName} Outfit`;
        rawTitle = rawTitle.replace(/\s*\|\s*Amazon.*$/i, '').replace(/\s*:\s*Amazon.*$/i, '').replace(/\s*-\s*Myntra.*$/i, '').trim();

        // 4. Price Extraction
        const priceMatch = html.match(/["']price["']\s*:\s*["']?(\d+(?:\.\d+)?)["']?/i) ||
                           html.match(/₹\s*([0-9,]+)/i) ||
                           html.match(/class=["'][^"']*a-price-whole[^"']*["']>([0-9,]+)/i);
        const priceStr = priceMatch ? `₹${priceMatch[1]}` : "Store Price";

        if (!extractedImage) {
          return NextResponse.json({
            success: false,
            error: "Store security prevented direct image scraping. Please use 'Upload Outfit Screenshot' for instant 100% try-on!"
          }, { status: 200 });
        }

        return NextResponse.json({
          success: true,
          garment: {
            id: `extracted-${Date.now()}`,
            title: rawTitle,
            brand: storeName,
            price: priceStr,
            store: storeName,
            image: extractedImage,
            image_url: extractedImage,
            direct_link: url,
            deal_link: url,
            fabric: "Store Garment",
            occasion: "All-Occasion Style",
            fit: "Standard Fit",
            rating: 4.5,
            tryon_compatible: true
          }
        });
      } catch (fetchErr) {
        safeLog('VTON Extract', `Fetch timeout or error: ${fetchErr.message}`);
        return NextResponse.json({
          success: false,
          error: "Store link connection timed out. Please upload a screenshot of the outfit for instant try-on."
        }, { status: 200 });
      }
    }

    return NextResponse.json({ success: false, error: "Please provide a valid URL or image." }, { status: 400 });
  } catch (err) {
    safeLog('VTON Extract Error', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
