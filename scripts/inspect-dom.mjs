import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating with domcontentloaded...');
  await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const allCanvas = Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      style: c.getAttribute('style'),
      rect: c.getBoundingClientRect()
    }));

    // Find all elements in the first screen
    const elementsInHero = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      const rect = node.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= 900 && rect.width > 50 && rect.height > 20) {
        elementsInHero.push({
          tag: node.tagName,
          id: node.id,
          className: typeof node.className === 'string' ? node.className : '',
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          text: node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 ? node.textContent.trim() : ''
        });
      }
    }

    return { allCanvas, elementsInHero: elementsInHero.slice(0, 40) };
  });

  console.log('Canvas:', data.allCanvas);
  console.log('Hero elements count:', data.elementsInHero.length);
  console.log('Hero elements sample:', JSON.stringify(data.elementsInHero.slice(0, 15), null, 2));

  // Screenshot
  await page.screenshot({ path: 'screenshots/nothin-dom.png' });
  await browser.close();
}

run().catch(console.error);

