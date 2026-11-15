import { chromium } from 'playwright';
import fs from 'fs';

async function inspectNothin() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log('Navigating to https://www.noth.in/fr ...');
  await page.goto('https://www.noth.in/fr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const heroDetails = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      className: typeof c.className === 'string' ? c.className : '',
      id: c.id,
      style: c.getAttribute('style')
    }));

    const filters = Array.from(document.querySelectorAll('filter, feDisplacementMap, feTurbulence')).map(f => f.outerHTML);

    const bodyChildren = Array.from(document.body.children).map(c => ({
      tag: c.tagName,
      className: typeof c.className === 'string' ? c.className : '',
      id: c.id,
      rect: c.getBoundingClientRect()
    }));

    // Find main letters element
    const svgElements = Array.from(document.querySelectorAll('svg')).map(s => ({
      className: typeof s.className === 'string' ? s.className : '',
      viewBox: s.getAttribute('viewBox'),
      rect: s.getBoundingClientRect(),
      paths: s.querySelectorAll('path').length
    }));

    return {
      canvases,
      filters,
      bodyChildren,
      svgElements
    };
  });

  console.log('Hero details:', JSON.stringify(heroDetails, null, 2));

  // Let's test hovering over NOTHIN' letters
  // Find where NOTHIN is located
  const letterPositions = await page.evaluate(() => {
    // Look for text or svg with nothin
    const svgs = Array.from(document.querySelectorAll('svg'));
    const results = [];
    for (const svg of svgs) {
      const rect = svg.getBoundingClientRect();
      results.push({ rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } });
    }
    return results;
  });

  console.log('Letter SVG positions:', letterPositions);

  // Hover over the center of the hero
  await page.mouse.move(720, 500);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/nothin-hover-center.png' });

  // Move mouse across the letters horizontally to trigger any fluid / liquid ripple effect
  for (let x = 200; x <= 1200; x += 100) {
    await page.mouse.move(x, 500);
    await page.waitForTimeout(80);
  }
  await page.screenshot({ path: 'screenshots/nothin-after-drag.png' });

  // Hover over the pill CTA "RÉSERVER UN APPEL"
  const button = await page.$('a, button');
  if (button) {
    const box = await button.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/nothin-hover-button.png' });
    }
  }

  await browser.close();
  console.log('Inspection completed.');
}

inspectNothin().catch(console.error);

