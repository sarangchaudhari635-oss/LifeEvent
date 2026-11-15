import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\Captain\\.gemini\\antigravity\\brain\\75c9837d-676b-40e2-b3e6-0c5d3ee4d621\\screenshots";

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const routes = [
  { name: "home-desktop", url: "http://localhost:3000/", viewport: { width: 1440, height: 900 } },
  { name: "intake-desktop", url: "http://localhost:3000/intake", viewport: { width: 1440, height: 900 } },
  { name: "journey-desktop", url: "http://localhost:3000/journey/demo-journey-cardiac-01", viewport: { width: 1440, height: 900 } },
  { name: "coverage-desktop", url: "http://localhost:3000/journey/demo-journey-cardiac-01/coverage", viewport: { width: 1440, height: 900 } },
  { name: "funding-desktop", url: "http://localhost:3000/journey/demo-journey-cardiac-01/funding", viewport: { width: 1440, height: 900 } },
  { name: "documents-desktop", url: "http://localhost:3000/documents", viewport: { width: 1440, height: 900 } },
  { name: "counselor-desktop", url: "http://localhost:3000/counselor", viewport: { width: 1440, height: 900 } },
  { name: "for-hospitals-desktop", url: "http://localhost:3000/for-hospitals", viewport: { width: 1440, height: 900 } },
  { name: "how-it-works-desktop", url: "http://localhost:3000/how-it-works", viewport: { width: 1440, height: 900 } },
  { name: "privacy-desktop", url: "http://localhost:3000/privacy", viewport: { width: 1440, height: 900 } },
  { name: "demo-script-desktop", url: "http://localhost:3000/demo-script", viewport: { width: 1440, height: 900 } },
  // Multi-viewport responsiveness on key subpages
  { name: "coverage-mobile-390", url: "http://localhost:3000/journey/demo-journey-cardiac-01/coverage", viewport: { width: 390, height: 844 } },
  { name: "funding-mobile-390", url: "http://localhost:3000/journey/demo-journey-cardiac-01/funding", viewport: { width: 390, height: 844 } },
  { name: "counselor-tablet-768", url: "http://localhost:3000/counselor", viewport: { width: 768, height: 1024 } }
];

async function run() {
  console.log("Starting visual verification across all pages...");
  const browser = await chromium.launch({ headless: true });

  for (const r of routes) {
    const page = await browser.newPage({ viewport: r.viewport });
    try {
      await page.goto(r.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1000);
      const outPath = path.join(ARTIFACTS_DIR, `audit-${r.name}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Captured: ${r.name} -> ${outPath}`);
    } catch (err) {
      console.error(`Failed ${r.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("Visual verification complete!");
}

run();
