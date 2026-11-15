// REA-style live capture + identical-sweep A/B: noth.in/fr (live) vs our stock copy vs our boosted build.
// Captures: live JS bundle, reveal video URL, timed frames during the same cursor sweep on all three.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// ---------- 1) LIVE CAPTURE: noth.in/fr ----------
const page = await ctx.newPage();
const jsFiles = [];
let videoUrl = null;
page.on("response", async (res) => {
  const url = res.url();
  const ct = (res.headers()["content-type"] || "").toLowerCase();
  if (ct.includes("javascript")) jsFiles.push({ url, size: 0 });
  if (ct.includes("video/") || /\.(mp4|webm)(\?|$)/i.test(url)) videoUrl = videoUrl || url;
});

try {
  await page.goto("https://www.noth.in/fr", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(6000);

  // Hero structure + key computed styles
  const heroInfo = await page.evaluate(() => {
    const sec = document.querySelector(".section-w") || document.querySelector("section");
    if (!sec) return null;
    const cs = getComputedStyle(sec);
    const svg = document.querySelector(".nothin-hero-svg");
    const vid = document.querySelector(".video-hero-bg");
    return {
      sectionClass: sec.className,
      fontFamily: cs.fontFamily,
      height: cs.height,
      svgPresent: !!svg,
      svgText: svg?.querySelector("text")?.textContent?.trim() || null,
      videoSrc: vid?.currentSrc || vid?.src || null,
      canvases: document.querySelectorAll("canvas").length,
    };
  });

  // Save the largest JS bundle for diffing
  for (const entry of jsFiles) {
    try {
      const res = await page.request.get(entry.url, { timeout: 30000 });
      const body = await res.body();
      entry.size = body.length;
      if (body.length > 100000) {
        writeFileSync("screenshots/nothin-live-bundle.js", body);
      }
    } catch {}
  }
  jsFiles.sort((a, b) => b.size - a.size);

  // Timed sweep on the live site
  await page.mouse.move(280, 450);
  const t0 = Date.now();
  for (let i = 0; i <= 40; i++) {
    const x = 280 + (i * 880) / 40;
    const y = 450 + Math.sin(i / 4) * 45;
    await page.mouse.move(x, y, { steps: 2 });
    await page.waitForTimeout(16);
  }
  const marks = [[250, "live-t250"], [700, "live-t700"], [1400, "live-t1400"]];
  let lastMark = 0;
  for (const [dt, name] of marks) {
    const wait = dt - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: `screenshots/ab-${name}.png` });
    lastMark = dt;
  }
  console.log("[noth.in live]", JSON.stringify({ heroInfo, videoUrl, biggestJS: jsFiles[0] }));
} catch (e) {
  console.log("[noth.in live] FAILED:", String(e).slice(0, 300));
}
await page.close();

// ---------- 2) IDENTICAL SWEEP: stock folder demo + our boosted app ----------
for (const { url, tag } of [
  { url: "http://localhost:3000/tophero/index.html", tag: "stock" },
  { url: "http://localhost:3000/", tag: "boosted" },
]) {
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(4000);
  await p.mouse.move(280, 450);
  const t0 = Date.now();
  for (let i = 0; i <= 40; i++) {
    const x = 280 + (i * 880) / 40;
    const y = 450 + Math.sin(i / 4) * 45;
    await p.mouse.move(x, y, { steps: 2 });
    await p.waitForTimeout(16);
  }
  for (const [dt, name] of [[250, "t250"], [700, "t700"], [1400, "t1400"]]) {
    const wait = dt - (Date.now() - t0);
    if (wait > 0) await p.waitForTimeout(wait);
    await p.screenshot({ path: `screenshots/ab-${tag}-${name}.png` });
  }
  console.log(`[${tag}] sweep done`);
  await p.close();
}

await browser.close();
console.log("AB capture complete");
