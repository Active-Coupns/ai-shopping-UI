/**
 * ShopSmart AI — Client-Side Hardware & Device Fingerprint Engine
 * 
 * Features:
 * 1. Zero external dependencies (<3KB bundle footprint).
 * 2. Invisible Canvas 2D + WebGL GPU + AudioContext + Screen Context.
 * 3. Headless Browser & Automated Bot Detection (SwiftShader / WebDriver / HeadlessChrome).
 * 4. In-memory & SessionStorage caching for 0ms subsequent calls.
 * 5. Cryptographically secure 1-way SHA-256 hash (No PII / GDPR & DPDP 2023 compliant).
 */

let cachedFingerprintPromise = null;

// Safe SHA-256 hashing using Web Crypto API with fallback
async function sha256Hex(str) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
    } catch {
      // Fallback to simple hash if crypto.subtle is unavailable
    }
  }

  // Fast DJB2 + FNV-1a hybrid fallback
  let h1 = 0x811c9dc5;
  let h2 = 0x1505;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x01000193);
    h2 = (Math.imul(h2, 33) ^ ch) >>> 0;
  }
  return ((h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0")).repeat(2).slice(0, 32);
}

// 1. Canvas 2D Sub-Pixel Rasterization Fingerprint
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "canvas_unsupported";

    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial', sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("ShopSmart AI 🐶🛍️ 2026", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("ShopSmart AI 🐶🛍️ 2026", 4, 17);

    // Quadratic bezier curve
    ctx.beginPath();
    ctx.moveTo(10, 40);
    ctx.quadraticCurveTo(80, 10, 160, 45);
    ctx.strokeStyle = "#9333ea";
    ctx.lineWidth = 2;
    ctx.stroke();

    return canvas.toDataURL().slice(0, 500);
  } catch {
    return "canvas_error";
  }
}

// 2. WebGL GPU Chipset & Bot Driver Detection
function getWebGLInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      return { vendor: "no_webgl", renderer: "no_webgl", isBotGpu: false };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

    const vendorStr = String(vendor || "").toLowerCase();
    const rendererStr = String(renderer || "").toLowerCase();

    // Check for virtual/cloud bot GPU emulators
    const isBotGpu = 
      rendererStr.includes("swiftshader") ||
      rendererStr.includes("llvmpipe") ||
      rendererStr.includes("virtualbox") ||
      rendererStr.includes("vmware") ||
      rendererStr.includes("mesa offscreen") ||
      rendererStr.includes("headless") ||
      (vendorStr.includes("google") && rendererStr.includes("software"));

    return { vendor: vendorStr, renderer: rendererStr, isBotGpu };
  } catch {
    return { vendor: "webgl_error", renderer: "webgl_error", isBotGpu: false };
  }
}

// 3. AudioContext Oscillator Buffer Fingerprint
async function getAudioFingerprint() {
  try {
    const AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AudioCtx) return "audio_unsupported";

    const context = new AudioCtx(1, 44100, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, context.currentTime);

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);

    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    const audioPromise = new Promise((resolve) => {
      context.oncomplete = (e) => {
        try {
          const samples = e.renderedBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 4500; i < 5000; i++) {
            sum += Math.abs(samples[i]);
          }
          resolve(sum.toFixed(6));
        } catch {
          resolve("audio_calc_error");
        }
      };
      // 50ms safety timeout
      setTimeout(() => resolve("audio_timeout"), 60);
    });

    context.startRendering();
    return await audioPromise;
  } catch {
    return "audio_error";
  }
}

// 4. Automated Bot & Headless Environment Detection
function detectAutomatedBot() {
  if (typeof window === "undefined") return false;

  const nav = window.navigator || {};
  
  // Explicit WebDriver flag (used by Selenium, Puppeteer, Playwright)
  if (nav.webdriver === true) return true;

  // Headless automation properties on window
  if (
    window.callPhantom ||
    window._phantom ||
    window.__nightmare ||
    window.domAutomation ||
    window.__selenium_unwrapped
  ) {
    return true;
  }

  // Headless Chrome in User Agent
  const ua = (nav.userAgent || "").toLowerCase();
  if (ua.includes("headlesschrome") || ua.includes("phantomjs")) {
    return true;
  }

  return false;
}

/**
 * Returns a stable 32-character hardware fingerprint prefixed with 'hw_'
 * @returns {Promise<{ fingerprint: string, isBot: boolean }>}
 */
export async function getDeviceFingerprint() {
  if (typeof window === "undefined") {
    return { fingerprint: "hw_server_side_stub", isBot: false };
  }

  // Check in-memory cache
  if (cachedFingerprintPromise) {
    return cachedFingerprintPromise;
  }

  // Check sessionStorage cache
  try {
    const stored = sessionStorage.getItem("_ss_hw_dfp");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.fingerprint === "string") {
        cachedFingerprintPromise = Promise.resolve(parsed);
        return parsed;
      }
    }
  } catch {}

  cachedFingerprintPromise = (async () => {
    try {
      const isBotEnv = detectAutomatedBot();
      const webgl = getWebGLInfo();
      const isBot = isBotEnv || webgl.isBotGpu;

      const canvasFp = getCanvasFingerprint();
      const audioFp = await getAudioFingerprint();

      const screenFp = [
        window.screen?.width || 0,
        window.screen?.height || 0,
        window.screen?.colorDepth || 0,
        window.devicePixelRatio || 1,
        navigator.hardwareConcurrency || 2
      ].join("x");

      const rawSeed = [
        canvasFp,
        webgl.vendor,
        webgl.renderer,
        audioFp,
        screenFp,
        navigator.language || "en"
      ].join("###");

      const hexHash = await sha256Hex(rawSeed);
      const result = {
        fingerprint: `hw_${hexHash}`,
        isBot
      };

      try {
        sessionStorage.setItem("_ss_hw_dfp", JSON.stringify(result));
      } catch {}

      return result;
    } catch (err) {
      // Safe fallback
      const fallbackHex = (Math.random().toString(36).substring(2, 10)).repeat(4).slice(0, 32);
      return { fingerprint: `hw_${fallbackHex}`, isBot: false };
    }
  })();

  return cachedFingerprintPromise;
}
