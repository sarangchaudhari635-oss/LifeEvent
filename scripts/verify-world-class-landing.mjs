import { chromium } from "playwright";

async function verifyLandingPage() {
  const browser = await chromium.launch();

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "laptop-1280", width: 1280, height: 800 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Full-page screenshot
    await page.screenshot({
      path: `screenshots/landing-v2-${vp.name}-full.png`,
      fullPage: true,
    });
    console.log(`Saved screenshots/landing-v2-${vp.name}-full.png`);

    // Top view
    await page.screenshot({
      path: `screenshots/landing-v2-${vp.name}-top.png`,
    });
    await page.close();
  }

  // Interactive verification on Desktop
  console.log("Running interactive component checks on Desktop...");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Verify Marquee
  const marquee = await page.locator("text=Live Integration Mesh").isVisible();
  console.log("Marquee telemetry present:", marquee);

  // 2. Click Question 3 in Crisis Questions Ledger
  const q3Btn = page.locator("text=What is our real out-of-pocket financial gap?");
  if (await q3Btn.isVisible()) {
    await q3Btn.click();
    await page.waitForTimeout(500);
    console.log("Clicked Question 03 (Gap Ambush)");
  }

  // 3. Click Simulator Button in Living Journey Line
  const roomToggle = page.locator("text=1. Room Category");
  if (await roomToggle.isVisible()) {
    await roomToggle.click();
    await page.waitForTimeout(600);
    console.log("Toggled Room Category in Journey Simulator");
  }

  // 4. Click Trap Test in Evidence Trap Inspector
  const trapBtn = page.locator("text=INJECT FAKE EXCLUSION TRAP");
  if (await trapBtn.isVisible()) {
    await trapBtn.click();
    await page.waitForTimeout(600);
    console.log("Injected Fake Exclusion Trap into Evidence Inspector");
  }

  // Capture interactive state
  await page.screenshot({
    path: `screenshots/landing-v2-interactive-state.png`,
    fullPage: true,
  });
  console.log("Saved screenshots/landing-v2-interactive-state.png");

  await browser.close();
  console.log("All visual checks completed successfully!");
}

verifyLandingPage().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
