const puppeteer = require("puppeteer-core");

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--window-size=1280,1050"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1050 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  
  const searchInput = await page.waitForSelector("input[type='text']");
  await searchInput.type("laptop under 50000");
  await page.click("button[type='submit']");

  await page.waitForFunction(() => document.querySelectorAll("div.space-y-3\\.5 button").length >= 3, { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    document.querySelectorAll("div.space-y-3\\.5 > div").forEach(box => {
      const b = Array.from(box.querySelectorAll("button")).find(x => !x.innerText.includes("Other") && !x.innerText.includes("Confirm") && !x.innerText.includes("Search"));
      if (b) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Confirm Preferences"));
    if (btn) btn.click();
  });

  await page.waitForFunction(() => document.body.innerText.includes("ASUS") || document.body.innerText.includes("Lenovo"), { timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = document.getElementById("in-chat-shopping-agent");
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));

  const input = await page.waitForSelector("#in-chat-shopping-agent input[type='text']");
  await input.type("Actually mujhe coding nahi karni, bas bed par late kar movies dekhna hai aur stylus se drawing karni hai, to kya mujhe tablet lena chahiye?");
  
  await page.evaluate(() => {
    document.querySelector("#in-chat-shopping-agent button[type='submit']")?.click();
  });

  console.log("Waiting for AI response...");
  await page.waitForFunction(() => {
    const container = document.getElementById("in-chat-shopping-agent");
    return container && 
           !container.innerText.includes("analyzing hardware specs") && 
           container.innerText.includes("Actually mujhe coding nahi karni");
  }, { timeout: 35000 });

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\1b4980bf-3ef0-4ba5-b726-d42c052d6f5b\\step6_intent_shift_final.png" });
  console.log("SUCCESS! Screenshot saved to step6_intent_shift_final.png");

  const text = await page.evaluate(() => document.getElementById("in-chat-shopping-agent")?.innerText);
  console.log("\n--- AI INTENT SHIFT RESPONSE ---\n", text);

  await browser.close();
}

capture().catch(e => console.error(e));
