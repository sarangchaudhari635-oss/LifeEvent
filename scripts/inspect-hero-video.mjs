import fs from 'fs';
import { chromium } from 'playwright';

async function checkHero() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.noth.in/fr', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const heroDetails = await page.evaluate(() => {
    const hero = document.querySelector('.hero-home, .nothin-hero-w, .section-fake-hero');
    const heroHtml = hero ? hero.outerHTML.substring(0, 3000) : 'not found';
    const video = document.querySelector('video');
    const videoSrc = video ? video.src || video.querySelector('source')?.src : 'no video';
    const cursor = document.querySelector('.cursor, [class*=\"cursor\"]');
    const cursorHtml = cursor ? cursor.outerHTML : 'no cursor';

    return { heroHtml, videoSrc, cursorHtml };
  });

  console.log('Video Source:', heroDetails.videoSrc);
  console.log('Cursor HTML:', heroDetails.cursorHtml);
  console.log('Hero HTML:\n', heroDetails.heroHtml);
  await browser.close();
}

checkHero().catch(console.error);

