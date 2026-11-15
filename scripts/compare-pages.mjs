import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Localhost
  const pageLocal = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageLocal.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageLocal.waitForTimeout(1000);
  await pageLocal.screenshot({ path: 'screenshots/compare-localhost-hero.png' });
  
  // 2. Vercel
  const pageVercel = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageVercel.goto('https://paytm-lifeevent-ai.vercel.app', { waitUntil: 'networkidle' });
  await pageVercel.waitForTimeout(1000);
  await pageVercel.screenshot({ path: 'screenshots/compare-vercel-hero.png' });

  // Scroll to marquee
  await pageLocal.evaluate(() => window.scrollBy(0, 900));
  await pageVercel.evaluate(() => window.scrollBy(0, 900));
  await pageLocal.waitForTimeout(500);
  await pageVercel.waitForTimeout(500);
  await pageLocal.screenshot({ path: 'screenshots/compare-localhost-marquee.png' });
  await pageVercel.screenshot({ path: 'screenshots/compare-vercel-marquee.png' });

  // Compare inner texts of body
  const localText = await pageLocal.evaluate(() => document.body.innerText);
  const vercelText = await pageVercel.evaluate(() => document.body.innerText);

  console.log('Local text length:', localText.length);
  console.log('Vercel text length:', vercelText.length);
  console.log('Body Text matches:', localText === vercelText);

  // Compare top section backgrounds
  const localBg = await pageLocal.evaluate(() => window.getComputedStyle(document.querySelector('.section-w')).backgroundColor);
  const vercelBg = await pageVercel.evaluate(() => window.getComputedStyle(document.querySelector('.section-w')).backgroundColor);
  console.log('Local hero bg:', localBg);
  console.log('Vercel hero bg:', vercelBg);

  await browser.close();
}

main().catch(console.error);
