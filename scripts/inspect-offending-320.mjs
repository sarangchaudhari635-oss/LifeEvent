import { chromium } from "playwright";

async function findOverflow() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 320, height: 600 } });
  await page.goto("http://localhost:3000/intake", { waitUntil: "networkidle" });

  const offendingElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = Array.from(document.querySelectorAll("*"));
    const results = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 0.5) {
        results.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: rect.right,
          width: rect.width,
          diff: rect.right - docWidth,
          html: el.outerHTML.slice(0, 150)
        });
      }
    }
    return results;
  });

  console.log("Offending elements count:", offendingElements.length);
  console.log("Details:", offendingElements.slice(0, 5));
  await browser.close();
}

findOverflow();
