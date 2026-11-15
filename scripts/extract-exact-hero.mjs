import { chromium } from 'playwright';
import fs from 'fs';

async function extractExactHero() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to https://www.noth.in/fr ...');
  await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const heroHTML = await page.evaluate(() => {
    const sectionW = document.querySelector('.section-w');
    const heroHome = document.querySelector('.section.hero-home');
    const heroSvg = document.querySelector('.nothin-hero-svg');
    const navBoiler = document.querySelector('.nav-boiler');
    const loader = document.querySelector('.loader');

    return {
      sectionWHTML: sectionW ? sectionW.outerHTML : null,
      heroHomeHTML: heroHome ? heroHome.outerHTML : null,
      heroSvgHTML: heroSvg ? heroSvg.outerHTML : null,
      navBoilerHTML: navBoiler ? navBoiler.outerHTML : null,
      loaderHTML: loader ? loader.outerHTML : null
    };
  });

  fs.writeFileSync('screenshots/nothin-hero-extracted.json', JSON.stringify(heroHTML, null, 2));
  console.log('Hero extracted successfully!');
  await browser.close();
}

extractExactHero().catch(console.error);

