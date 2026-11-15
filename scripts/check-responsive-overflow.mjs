import { chromium } from "playwright";

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "small-mobile-320", width: 320, height: 568 },
];

const urls = [
  "http://localhost:3000/",
  "http://localhost:3000/intake",
  "http://localhost:3000/journey/demo-journey-cardiac-01",
  "http://localhost:3000/journey/demo-journey-cardiac-01/coverage",
  "http://localhost:3000/journey/demo-journey-cardiac-01/funding",
  "http://localhost:3000/documents",
  "http://localhost:3000/counselor",
  "http://localhost:3000/for-hospitals",
  "http://localhost:3000/how-it-works",
  "http://localhost:3000/privacy",
  "http://localhost:3000/demo-script"
];

async function checkOverflow() {
  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 12000 });
        const overflow = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;
          const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
          const clientWidth = html.clientWidth;
          
          let overflowElements = [];
          if (scrollWidth > clientWidth) {
            const all = document.querySelectorAll('*');
            all.forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > clientWidth + 2) {
                overflowElements.push({
                  tag: el.tagName,
                  className: (el.className || '').toString().slice(0, 80),
                  right: Math.round(r.right),
                  clientWidth: clientWidth
                });
              }
            });
          }
          return {
            hasOverflow: scrollWidth > clientWidth,
            scrollWidth,
            clientWidth,
            diff: scrollWidth - clientWidth,
            overflowElements: overflowElements.slice(0, 5)
          };
        });

        if (overflow.hasOverflow) {
          issues.push({
            viewport: vp.name,
            width: vp.width,
            url,
            diff: overflow.diff,
            elements: overflow.overflowElements
          });
          console.log(`[OVERFLOW] ${vp.name} (${vp.width}px) on ${url} by ${overflow.diff}px`);
        } else {
          console.log(`[OK] ${vp.name} on ${url}`);
        }
      } catch (err) {
        console.error(`Error on ${url} (${vp.name}):`, err.message);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log("\n--- OVERFLOW SUMMARY ---");
  console.log(`Total issues found: ${issues.length}`);
  console.log(JSON.stringify(issues, null, 2));
}

checkOverflow();
