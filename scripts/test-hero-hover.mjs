// Hover-reveal strength comparison: Next.js landing vs standalone TopHero demo.
// Sweeps the mouse across the hero and captures screenshots mid-sweep and after.
import { chromium } from "playwright";

const targets = [
  { url: "http://localhost:3000/", tag: "nextapp" },
  { url: "http://localhost:3000/tophero/index.html", tag: "standalone" },
];

const browser = await chromium.launch({ args: ["--use-angle=default"] });
for (const { url, tag } of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(4000); // let video start + canvas bake

  const videoState = await page.evaluate(() => {
    const v = document.querySelector(".video-hero-bg");
    if (!v) return null;
    return { paused: v.paused, muted: v.muted, time: v.currentTime, readyState: v.readyState };
  });

  const canvasCount = await page.evaluate(
    () => document.querySelectorAll(".mask-reveal-canvas").length
  );

  // Sweep across the "LifeEvent AI" text band (hero is centered ~ y=430-470)
  await page.mouse.move(280, 450);
  for (let i = 0; i <= 40; i++) {
    const x = 280 + (i * 880) / 40;
    const y = 450 + Math.sin(i / 4) * 45;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(16);
  }
  await page.screenshot({ path: `screenshots/hero-hover-${tag}-mid.png` });

  await page.waitForTimeout(1200);
  await page.screenshot({ path: `screenshots/hero-hover-${tag}-after.png` });

  console.log(
    `[${tag}] video=${JSON.stringify(videoState)} canvases=${canvasCount} errors=${errors.length ? errors.join(" | ") : "none"}`
  );
  await page.close();
}
await browser.close();
console.log("done");
