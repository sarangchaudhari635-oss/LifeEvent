import fs from "fs";
import { chromium } from "playwright";

async function compareAlignment() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000");
  await page.waitForTimeout(2000);

  // Measure rendered text bounding box on live page
  const metrics = await page.evaluate(() => {
    const text = document.querySelector(".nothin-hero-svg text");
    const r = text?.getBoundingClientRect();
    return {
      left: r?.left,
      right: r?.right,
      width: r?.width,
      top: r?.top,
      bottom: r?.bottom,
      height: r?.height,
      centerX: (r?.left + r?.right) / 2,
      centerY: (r?.top + r?.bottom) / 2
    };
  });

  console.log("=== Rendered SVG Text Bounds ===");
  console.log(metrics);

  // Take screenshot with video visible at 50% opacity and text at 50% opacity
  await page.evaluate(() => {
    const canvas = document.querySelector(".mask-reveal-canvas");
    if (canvas) canvas.style.display = "none";
    
    const svgEl = document.querySelector(".nothin-hero-svg");
    if (svgEl) {
      svgEl.style.opacity = "0.6";
      svgEl.style.display = "block";
      const text = svgEl.querySelector("text");
      if (text) text.setAttribute("fill", "#00ffcc"); // Bright cyan
    }

    const video = document.querySelector(".video-hero-bg");
    if (video) {
      video.style.opacity = "0.7";
      video.style.zIndex = "10";
      video.currentTime = 1.0;
    }

    const sec = document.querySelector(".section-w .section.hero-home");
    if (sec) {
      sec.style.zIndex = "20";
      sec.style.backgroundColor = "transparent";
    }
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "screenshots/overlay-comparison.png" });
  console.log("Saved screenshots/overlay-comparison.png");

  await browser.close();
}

compareAlignment();
