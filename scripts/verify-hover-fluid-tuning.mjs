import { chromium } from "playwright";

async function testTuning() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Loading http://localhost:3000/ ...");
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  await page.waitForTimeout(3000);

  // 1. Move mouse across center of text to trigger fluid liquid reveal
  console.log("Hovering across hero text...");
  await page.mouse.move(150, 430);
  for (let i = 0; i <= 25; i++) {
    const x = 150 + (i * 1150) / 25;
    const y = 430 + Math.sin(i / 2.5) * 35;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(20);
  }

  // Capture peak reveal with slightly larger visible hover area
  await page.screenshot({ path: "screenshots/hero-tuned-hover-reveal.png" });
  console.log("Saved screenshots/hero-tuned-hover-reveal.png");

  // 2. Move cursor away to top-left corner and observe smooth, slightly faster fade-out
  console.log("Moving cursor away to observe fade-out speed...");
  await page.mouse.move(20, 20, { steps: 5 });
  await page.waitForTimeout(400); // 400ms after departure
  await page.screenshot({ path: "screenshots/hero-tuned-fadeout-400ms.png" });
  console.log("Saved screenshots/hero-tuned-fadeout-400ms.png");

  await page.waitForTimeout(600); // 1000ms after departure
  await page.screenshot({ path: "screenshots/hero-tuned-fadeout-1000ms.png" });
  console.log("Saved screenshots/hero-tuned-fadeout-1000ms.png");

  await browser.close();
  console.log("Fluid hover tuning test completed successfully!");
}

testTuning().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
