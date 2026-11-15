import { chromium } from 'playwright';
import fs from 'fs';

async function extractStyles() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const styles = await page.evaluate(() => {
    const selectors = [
      '.section-w',
      '.video-hero-bg',
      '.section-fake-hero',
      '.div-block',
      '.p-l',
      '.btn.black-blend',
      '.btn__text',
      '.btn__text-p',
      '.arrow-w',
      '.arrow.black-blend',
      '.line-arrow',
      '.shape-arrow',
      '.link-hero-bottom-w',
      '.h1',
      '.link-hero-lang-w',
      '.link-hero-w',
      '.link',
      '.lang-wrapper',
      '.lang-list',
      '.lang-item',
      '.lang-link',
      '.section.hero-home',
      '.container.hero-home',
      '.nothin-hero-w',
      '.nothin-hero-svg',
      '.loader',
      '.loader-c',
      '.loader-anim',
      '.n-load',
      '.loader-img-w',
      '.loader-img',
      '.apos-load',
      '.loader-nbr-w'
    ];

    const result = {};
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const cs = window.getComputedStyle(el);
        result[sel] = {
          display: cs.display,
          position: cs.position,
          top: cs.top,
          left: cs.left,
          right: cs.right,
          bottom: cs.bottom,
          width: cs.width,
          height: cs.height,
          padding: cs.padding,
          margin: cs.margin,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          border: cs.border,
          borderRadius: cs.borderRadius,
          zIndex: cs.zIndex,
          transform: cs.transform,
          overflow: cs.overflow,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          flexDirection: cs.flexDirection
        };
      }
    }
    return result;
  });

  fs.writeFileSync('screenshots/nothin-computed-styles.json', JSON.stringify(styles, null, 2));
  console.log('Saved computed styles for all nothin hero elements!');
  await browser.close();
}

extractStyles().catch(console.error);

