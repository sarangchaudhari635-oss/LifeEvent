import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:/Users/Captain/.gemini/antigravity/brain/75c9837d-676b-40e2-b3e6-0c5d3ee4d621/screenshots';

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop 1440px
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero + Restored Marquee
  await page.screenshot({
    path: path.join(screenshotDir, 'final-01-hero-desktop.png'),
  });
  console.log('Captured: final-01-hero-desktop.png');

  // 2. Marquee section
  const marquee = page.locator('section:has-text("LIVE INTEGRATION MESH")');
  if (await marquee.count() > 0) {
    await marquee.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await marquee.first().screenshot({
      path: path.join(screenshotDir, 'final-02-restored-black-marquee.png'),
    });
    console.log('Captured: final-02-restored-black-marquee.png');
  }

  // 3. Crisis Ledger
  const ledger = page.locator('section:has-text("CRISIS RESPONSE ARCHITECTURE")');
  if (await ledger.count() > 0) {
    await ledger.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await ledger.first().screenshot({
      path: path.join(screenshotDir, 'final-03-crisis-ledger-black-accent.png'),
    });
    console.log('Captured: final-03-crisis-ledger-black-accent.png');
  }

  // 4. Paytm Bridge
  const bridge = page.locator('section:has-text("PAYTM EMERGENCY LIQUIDITY RAIL")');
  if (await bridge.count() > 0) {
    await bridge.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await bridge.first().screenshot({
      path: path.join(screenshotDir, 'final-04-paytm-bridge-black-accent.png'),
    });
    console.log('Captured: final-04-paytm-bridge-black-accent.png');
  }

  // 5. Hackathon Differentiation & Clean Obsidian Launchpad
  const launchpad = page.locator('section:has-text("HACKATHON DIFFERENTIATION MATRIX")');
  if (await launchpad.count() > 0) {
    await launchpad.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await launchpad.first().screenshot({
      path: path.join(screenshotDir, 'final-05-hackathon-launchpad-clean.png'),
    });
    console.log('Captured: final-05-hackathon-launchpad-clean.png');
  }

  // 6. Mobile 390px
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileMarquee = mobilePage.locator('section:has-text("LIVE INTEGRATION MESH")');
  if (await mobileMarquee.count() > 0) {
    await mobileMarquee.first().scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(400);
    await mobileMarquee.first().screenshot({
      path: path.join(screenshotDir, 'final-06-mobile-390-black-marquee.png'),
    });
    console.log('Captured: final-06-mobile-390-black-marquee.png');
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(console.error);
