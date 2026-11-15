// Fade-out responsiveness test: sweep, stop, capture the reveal clearing.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(4000);

// sweep left -> right across the text
await page.mouse.move(280, 450);
for (let i = 0; i <= 40; i++) {
  const x = 280 + (i * 880) / 40;
  const y = 450 + Math.sin(i / 4) * 45;
  await page.mouse.move(x, y, { steps: 2 });
  await page.waitForTimeout(16);
}
const t0 = Date.now();
for (const [dt, name] of [[300, "fade-300ms"], [700, "fade-700ms"], [1200, "fade-1200ms"]]) {
  const wait = dt - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `screenshots/${name}.png` });
}
console.log("fade captures done");
await browser.close();
