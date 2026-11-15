import { chromium } from 'playwright';

async function testExactClone() {
  console.log('Testing exact noth.in hero clone on http://localhost:3000 ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  // Capture preloader midway
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/exact-clone-preloader.png' });
  console.log('Saved screenshots/exact-clone-preloader.png');

  // Wait for preloader completion and hero entrance
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/exact-clone-revealed.png' });
  console.log('Saved screenshots/exact-clone-revealed.png');

  // Move mouse across the NOTHIN' letters to cut fluid holes and reveal video
  for (let x = 200; x <= 1200; x += 40) {
    const y = 480 + Math.sin(x / 50) * 35;
    await page.mouse.move(x, y);
    await page.waitForTimeout(30);
  }

  await page.waitForTimeout(200);
  await page.screenshot({ path: 'screenshots/exact-clone-liquid-video-reveal.png' });
  console.log('Saved screenshots/exact-clone-liquid-video-reveal.png');

  await browser.close();
  console.log('Exact clone tests finished!');
}

testExactClone().catch(console.error);

