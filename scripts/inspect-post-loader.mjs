import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating and waiting for full loader completion...');
  await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(6000); // Wait 6 seconds for loader to finish!

  const heroData = await page.evaluate(() => {
    // Look at main hero section
    const heroSection = document.querySelector('section, header, [class*=\"hero\"]');
    
    // Check if there are any canvas now
    const canvasList = Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      style: c.getAttribute('style')
    }));

    // Find the giant NOTHIN letters element
    const nothinElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const text = el.textContent || '';
      return el.children.length === 0 && (text.includes('NOTHIN') || text.includes('N') || text.includes('O'));
    }).slice(0, 20).map(el => ({
      tag: el.tagName,
      className: typeof el.className === 'string' ? el.className : '',
      parentClass: el.parentElement ? (typeof el.parentElement.className === 'string' ? el.parentElement.className : '') : '',
      text: el.textContent
    }));

    // Find all elements with classes in hero
    const allHeroClasses = Array.from(document.querySelectorAll('[class*=\"hero\"], [class*=\"home\"], [class*=\"title\"], [class*=\"liquid\"], [class*=\"cursor\"], [class*=\"hover\"]')).map(el => ({
      tag: el.tagName,
      className: typeof el.className === 'string' ? el.className : '',
      id: el.id
    }));

    return { canvasList, nothinElements, allHeroClasses: allHeroClasses.slice(0, 30) };
  });

  console.log('Hero Data after 6s:', JSON.stringify(heroData, null, 2));

  // Take screenshot after 6s
  await page.screenshot({ path: 'screenshots/nothin-after-6s.png' });

  // Now hover over the big letters and move mouse
  await page.mouse.move(400, 500);
  await page.waitForTimeout(300);
  await page.mouse.move(720, 500);
  await page.waitForTimeout(300);
  await page.mouse.move(900, 500);
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshots/nothin-hovered.png' });
  await browser.close();
}

run().catch(console.error);

