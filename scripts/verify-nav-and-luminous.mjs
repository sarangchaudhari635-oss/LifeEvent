import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\Captain\\.gemini\\antigravity\\brain\\75c9837d-676b-40e2-b3e6-0c5d3ee4d621\\screenshots";

async function run() {
  const browser = await chromium.launch({ headless: true });

  const pagesToTest = [
    { name: "fixed-nav-journey-desktop", url: "http://localhost:3000/journey/demo-journey-cardiac-01", width: 1440, height: 900 },
    { name: "fixed-nav-funding-desktop", url: "http://localhost:3000/journey/demo-journey-cardiac-01/funding", width: 1440, height: 900 },
    { name: "fixed-nav-counselor-desktop", url: "http://localhost:3000/counselor", width: 1440, height: 900 },
    { name: "fixed-nav-home-desktop", url: "http://localhost:3000/", width: 1440, height: 900 }
  ];

  for (const p of pagesToTest) {
    const page = await browser.newPage({ viewport: { width: p.width, height: p.height } });
    await page.goto(p.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const outPath = path.join(ARTIFACTS_DIR, `${p.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Captured: ${p.name} -> ${outPath}`);
    await page.close();
  }

  await browser.close();
}

run();
