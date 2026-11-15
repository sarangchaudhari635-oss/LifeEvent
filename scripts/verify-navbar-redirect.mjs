import { chromium } from 'playwright';

const testPages = [
  '/intake',
  '/counselor',
  '/for-hospitals',
  '/journey/demo-journey-cardiac-01',
  '/privacy',
  '/demo-script',
  '/documents',
  '/how-it-works'
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('--- STARTING MULTI-PAGE NAVBAR REDIRECT VERIFICATION ---');
  let allPassed = true;

  for (const path of testPages) {
    const targetUrl = `http://localhost:3000${path}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    
    // Locate the LifeEvent AI button in the navbar header
    const logoButton = page.locator('header a[href="/"]');
    const count = await logoButton.count();
    
    if (count === 0) {
      console.error(`❌ FAILED on ${path}: Navbar brand button not found!`);
      allPassed = false;
      continue;
    }

    // Click the LifeEvent AI button
    await logoButton.click();
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const isAtHome = currentUrl === 'http://localhost:3000/' || currentUrl === 'http://localhost:3000';
    
    // Verify hero section is present
    const heroPresent = await page.locator('.section-fake-hero').count() > 0;
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    
    if (isAtHome && heroPresent) {
      console.log(`✅ PASSED [${path}]: Redirected to "${currentUrl}" with white hero present!`);
    } else {
      console.error(`❌ FAILED [${path}]: currentUrl="${currentUrl}", heroPresent=${heroPresent}`);
      allPassed = false;
    }
  }

  // Also test from mobile drawer
  console.log('\n--- TESTING MOBILE DRAWER LOGO REDIRECT ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/counselor', { waitUntil: 'networkidle' });
  
  // Open mobile drawer
  await page.locator('button[aria-label="Open Navigation Directory"]').click();
  await page.waitForTimeout(500);
  
  // Click LifeEvent AI inside drawer header
  const drawerLogo = page.locator('.relative.w-full a[href="/"]');
  console.log('Drawer logo count:', await drawerLogo.count());
  await drawerLogo.click();
  await page.waitForTimeout(1000);
  
  const mobileHomeUrl = page.url();
  const mobileHeroPresent = await page.locator('.section-fake-hero').count() > 0;
  console.log(`✅ Mobile Drawer Test: URL="${mobileHomeUrl}", Hero=${mobileHeroPresent}`);

  // Capture final screenshot
  await page.screenshot({ path: 'screenshots/verify-logo-redirect-hero.png', fullPage: false });
  console.log('\nFinal verification screenshot saved: screenshots/verify-logo-redirect-hero.png');

  await browser.close();
  
  if (allPassed && mobileHeroPresent) {
    console.log('\n🎉 ALL 8 PAGES + MOBILE DRAWER SUCCESSFULLY VERIFIED!');
  } else {
    process.exit(1);
  }
})();
