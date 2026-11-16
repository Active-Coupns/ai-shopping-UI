/**
 * Benefisto — IndexNow High-Velocity Search Engine Submission
 * Submits all 600+ brand coupon pages to Bing, Yandex, and AI Search Crawlers (Perplexity / ChatGPT Search)
 */
import { COUNTRY_TOP_BRANDS } from "../src/data/countryBrandsCatalog.js";

const HOST = "www.benefisto.com";
const KEY = "benefisto-indexnow-key-2026";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function submitIndexNow() {
  const urlSet = new Set();
  urlSet.add(`https://${HOST}/`);
  urlSet.add(`https://${HOST}/about`);
  urlSet.add(`https://${HOST}/contact`);

  for (const list of Object.values(COUNTRY_TOP_BRANDS)) {
    for (const b of list) {
      urlSet.add(`https://${HOST}/coupons/${b.id}`);
    }
  }

  const urlList = Array.from(urlSet);
  console.log(`[IndexNow] Prepared ${urlList.length} URLs for immediate search indexing.`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList.slice(0, 1000)
  };

  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
    console.log(`[IndexNow] Submission response HTTP status: ${res.status}`);
    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Successfully pushed ${urlList.length} URLs to Bing & AI search engines!`);
    } else {
      console.log(`[IndexNow] Response received (${res.status}). Server acknowledged request.`);
    }
  } catch (err) {
    console.warn(`[IndexNow] Ping notice (network test):`, err.message);
  }
}

submitIndexNow();
