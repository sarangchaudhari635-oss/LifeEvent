import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

async function analyze() {
  console.log('Navigating to https://www.noth.in/fr ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const networkAssets = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('.js') || url.includes('.css') || url.includes('font') || url.includes('.woff')) {
      networkAssets.push({ url, status: res.status(), type: res.headers()['content-type'] });
    }
  });

  try {
    await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000); // Allow initial animations to play out

    // Capture initial load screenshot
    await page.screenshot({ path: 'screenshots/nothin-hero.png', fullPage: false });
    console.log('✓ Captured screenshots/nothin-hero.png');

    // Extract deep DOM, styles, animation triggers, and structure
    const data = await page.evaluate(() => {
      // Find all elements in the viewport
      const elements = Array.from(document.querySelectorAll('*'));
      
      // Look for the big NOTHIN' headline
      const bigTextEl = elements.find(el => el.textContent?.trim() === "NOTHIN'" || el.textContent?.trim() === 'NOTHIN');
      
      let bigTextMetrics = null;
      if (bigTextEl) {
        const s = window.getComputedStyle(bigTextEl);
        const rect = bigTextEl.getBoundingClientRect();
        bigTextMetrics = {
          tagName: bigTextEl.tagName,
          className: bigTextEl.className,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          fontFamily: s.fontFamily,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          textAlign: s.textAlign,
          color: s.color,
          transform: s.transform,
          rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left }
        };
      }

      // Check header/nav & subheadings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button')).map(el => {
        const s = window.getComputedStyle(el);
        const text = el.textContent?.trim();
        if (!text || text.length > 100) return null;
        return {
          tag: el.tagName,
          text,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          fontFamily: s.fontFamily,
          color: s.color,
          transform: s.transform,
          opacity: s.opacity,
          letterSpacing: s.letterSpacing,
          textTransform: s.textTransform
        };
      }).filter(Boolean);

      // Check keyframes and animation styles in stylesheets
      const cssRules = [];
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.type === CSSRule.KEYFRAMES_RULE || rule.selectorText?.includes('hero') || rule.selectorText?.includes('title')) {
                cssRules.push(rule.cssText);
              }
            }
          } catch (e) {}
        }
      } catch (e) {}

      // Window inspection for animation frameworks
      const frameworkInfo = {
        hasGSAP: typeof window.gsap !== 'undefined',
        hasLenis: typeof window.Lenis !== 'undefined',
        hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
        nextData: typeof window.__NEXT_DATA__ !== 'undefined' ? window.__NEXT_DATA__ : null,
        bodyClass: document.body.className
      };

      return {
        title: document.title,
        frameworkInfo,
        bigTextMetrics,
        headings: headings.slice(0, 30),
        cssRules: cssRules.slice(0, 30),
        htmlStructure: document.body.innerHTML.slice(0, 4000)
      };
    });

    writeFileSync('screenshots/nothin-analysis.json', JSON.stringify({ data, networkAssets }, null, 2));
    console.log('✓ Saved detailed analysis to screenshots/nothin-analysis.json');
  } catch (err) {
    console.error('Failed to analyze nothin:', err);
  } finally {
    await browser.close();
  }
}

analyze();

