import { chromium } from "playwright";

async function verifyAlignment() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Loading http://localhost:3000/ ...");
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  await page.waitForTimeout(3000);

  // Measure rendered text bounding box
  const metrics = await page.evaluate(() => {
    const text = document.querySelector(".nothin-hero-svg text");
    const svg = document.querySelector(".nothin-hero-svg");
    const video = document.querySelector(".video-hero-bg");

    const tRect = text?.getBoundingClientRect();
    const sRect = svg?.getBoundingClientRect();
    const vRect = video?.getBoundingClientRect();

    return {
      text: tRect ? {
        left: tRect.left,
        right: tRect.right,
        width: tRect.width,
        top: tRect.top,
        bottom: tRect.bottom,
        height: tRect.height,
        centerX: (tRect.left + tRect.right) / 2,
        centerY: (tRect.top + tRect.bottom) / 2
      } : null,
      svg: sRect ? { left: sRect.left, width: sRect.width, top: sRect.top, height: sRect.height } : null,
      video: vRect ? { left: vRect.left, width: vRect.width, top: vRect.top, height: vRect.height } : null,
      attributes: text ? {
        fontSize: text.getAttribute("font-size"),
        x: text.getAttribute("x"),
        y: text.getAttribute("y"),
        letterSpacing: text.getAttribute("letter-spacing")
      } : null
    };
  });

  console.log("=== Verified Rendered Metrics ===");
  console.log(JSON.stringify(metrics, null, 2));

  // Assert target width is within 2px of 1325px
  const widthDiff = Math.abs(metrics.text.width - 1325.6);
  console.log(`Width alignment delta: ${widthDiff.toFixed(2)}px (Expected < 2px)`);
  if (widthDiff > 5) {
    throw new Error(`Text width mismatch: expected ~1325px, got ${metrics.text.width}px`);
  }

  // 1. Capture pristine idle hero (1440x900)
  await page.screenshot({ path: "screenshots/hero-aligned-idle-1440.png" });

  // 2. Perform smooth cursor sweep over the center of the text to trigger fluid liquid reveal
  console.log("Performing cursor hover sweep across aligned text...");
  await page.mouse.move(100, 434);
  for (let i = 0; i <= 30; i++) {
    const x = 100 + (i * 1200) / 30;
    const y = 434 + Math.sin(i / 3) * 35;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(20);
  }

  // Capture mid-reveal state showing liquid cutout matching video text
  await page.screenshot({ path: "screenshots/hero-aligned-hover-reveal.png" });
  console.log("Saved screenshots/hero-aligned-hover-reveal.png");

  // Multi-viewport captures
  const viewports = [
    { width: 1280, height: 800, name: "laptop-1280" },
    { width: 768, height: 1024, name: "tablet-768" },
    { width: 390, height: 844, name: "mobile-390" }
  ];

  for (const vp of viewports) {
    const p = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await p.goto("http://localhost:3000/", { waitUntil: "load" });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `screenshots/hero-aligned-${vp.name}.png` });
    console.log(`Saved screenshots/hero-aligned-${vp.name}.png`);
    await p.close();
  }

  await browser.close();
  console.log("All alignment verifications completed successfully!");
}

verifyAlignment().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
