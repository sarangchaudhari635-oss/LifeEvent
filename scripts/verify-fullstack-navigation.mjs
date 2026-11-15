import { chromium } from "playwright";

async function verifyAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("1. Testing Homepage (http://localhost:3000) ...");
  await page.goto("http://localhost:3000", { waitUntil: "load" });
  await page.waitForTimeout(2500);

  // Take screenshot of clean updated hero
  await page.screenshot({ path: "screenshots/hero-updated-idle-1440.png" });
  console.log("Saved screenshots/hero-updated-idle-1440.png");

  // 2. Open Slide-over Menu Drawer
  console.log("2. Testing Menu Drawer open ...");
  const menuBtn = await page.waitForSelector(".menu-toggle", { timeout: 5000 });
  await menuBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "screenshots/menu-drawer-open-1440.png" });
  console.log("Saved screenshots/menu-drawer-open-1440.png");

  // Close drawer
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 3. Test Liquid Hover Reveal
  console.log("3. Performing cursor hover reveal sweep ...");
  await page.mouse.move(100, 430);
  for (let i = 0; i <= 30; i++) {
    const x = 100 + (i * 1200) / 30;
    const y = 430 + Math.sin(i / 3) * 30;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(20);
  }
  await page.screenshot({ path: "screenshots/hero-updated-hover-reveal.png" });
  console.log("Saved screenshots/hero-updated-hover-reveal.png");

  // 4. Test all route connections
  const routes = [
    { name: "intake", url: "http://localhost:3000/intake", check: "h1, h2" },
    { name: "journey", url: "http://localhost:3000/journey/demo-journey-cardiac-01", check: "text=Ramesh" },
    { name: "coverage", url: "http://localhost:3000/journey/demo-journey-cardiac-01/coverage", check: "text=Clause Evidence Inspector" },
    { name: "funding", url: "http://localhost:3000/journey/demo-journey-cardiac-01/funding", check: "text=Emergency Funding" },
    { name: "documents", url: "http://localhost:3000/documents", check: "text=Document Hub & Privacy Redactor" },
    { name: "counselor", url: "http://localhost:3000/counselor", check: "text=Counselor" },
    { name: "for-hospitals", url: "http://localhost:3000/for-hospitals", check: "text=Hospital" },
    { name: "privacy", url: "http://localhost:3000/privacy", check: "text=Privacy" },
    { name: "demo-script", url: "http://localhost:3000/demo-script", check: "text=3-Minute Live Judge Demo Script" }
  ];

  console.log("4. Verifying seamless connectivity across all 9 routes ...");
  for (const r of routes) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const resp = await p.goto(r.url, { waitUntil: "load" });
    if (resp.status() !== 200) {
      throw new Error(`Route ${r.url} returned status ${resp.status()}`);
    }
    await p.waitForSelector(r.check, { timeout: 6000 });
    console.log(`✓ Route [${r.name}] connected & returned 200 OK`);
    if (r.name === "demo-script") {
      await p.screenshot({ path: "screenshots/demo-script-1440.png" });
      console.log("Saved screenshots/demo-script-1440.png");
    }
    await p.close();
  }

  // 5. Multi-viewport captures for the homepage
  const vps = [
    { width: 1280, height: 800, name: "laptop-1280" },
    { width: 768, height: 1024, name: "tablet-768" },
    { width: 390, height: 844, name: "mobile-390" }
  ];

  for (const vp of vps) {
    const p = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await p.goto("http://localhost:3000", { waitUntil: "load" });
    await p.waitForTimeout(2000);
    await p.screenshot({ path: `screenshots/hero-updated-${vp.name}.png` });
    console.log(`Saved screenshots/hero-updated-${vp.name}.png`);
    await p.close();
  }

  await browser.close();
  console.log("ALL FULLSTACK & NAVIGATION VERIFICATIONS PASSED 100%!");
}

verifyAll().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
