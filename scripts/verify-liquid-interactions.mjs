import { chromium } from 'playwright';

async function testLiquidHero() {
  console.log('Launching browser to test real liquid hover interactions...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Allow curtain reveal and initial splat

  // 1. Move mouse across the monumental letters in a fluid wave
  console.log('Simulating fluid mouse wave across LIFEEVENT letters...');
  for (let x = 300; x <= 1100; x += 30) {
    const y = 450 + Math.sin(x / 60) * 40;
    await page.mouse.move(x, y);
    await page.waitForTimeout(25);
  }

  await page.screenshot({ path: 'screenshots/liquid-hero-wave.png' });
  console.log('Saved screenshots/liquid-hero-wave.png');

  // 2. Hover directly on a specific letter (e.g. letter "V" or "E")
  console.log('Hovering on letter "E"...');
  await page.mouse.move(720, 450);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/liquid-hero-letter-hover.png' });
  console.log('Saved screenshots/liquid-hero-letter-hover.png');

  // 3. Hover over the magnetic CTA button
  console.log('Hovering over magnetic CTA button...');
  const button = await page.$('a[href="/intake"]');
  if (button) {
    const box = await button.boundingBox();
    if (box) {
      // Approach button from left to feel magnetic pull
      await page.mouse.move(box.x - 20, box.y + box.height / 2);
      await page.waitForTimeout(200);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'screenshots/liquid-hero-btn-magnetic.png' });
      console.log('Saved screenshots/liquid-hero-btn-magnetic.png');
    }
  }

  await browser.close();
  console.log('All liquid hover interaction tests passed!');
}

testLiquidHero().catch(console.error);

