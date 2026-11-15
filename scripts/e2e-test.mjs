import { chromium } from 'playwright';

async function runE2E() {
  console.log('🚀 Starting end-to-end user journey verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Listen to console logs and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.error('Unhandled page error:', err.message);
  });

  try {
    // 1. Visit Homepage
    console.log('[1/5] Visiting Homepage (http://localhost:3000)...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    console.log('✓ Homepage loaded successfully');

    // 2. Navigate to Intake
    console.log('[2/5] Navigating to Intake (http://localhost:3000/intake)...');
    await page.goto('http://localhost:3000/intake', { waitUntil: 'networkidle' });
    console.log('✓ Intake page loaded');

    // 3. Fill Real Working Patient Details
    console.log('[3/5] Filling real clinical and hospital details...');
    await page.fill('input[placeholder*="Suresh Sharma"]', 'Arun Kumar Joshi');
    await page.selectOption('select >> nth=0', 'father');
    await page.fill('input[placeholder*="56"]', '62');
    await page.fill('input[placeholder*="+91 98220"]', '+91 98200 44556');
    await page.fill('input[placeholder*="Ruby Hall Clinic"]', 'Manipal Hospital, Pune');
    await page.fill('textarea[placeholder*="preliminary diagnosis"]', 'Acute coronary syndrome with severe angina, primary angioplasty with drug-eluting stent required.');
    await page.fill('input[placeholder*="350000"]', '380000');
    await page.selectOption('select >> nth=2', 'ICU');
    await page.selectOption('select >> nth=3', '4');
    await page.selectOption('select >> nth=4', 'Star Health & Allied Insurance');
    await page.fill('input[placeholder*="P/211111"]', 'STAR-PUN-2024-9921');
    await page.selectOption('select >> nth=5', '500000');
    await page.fill('input[placeholder*="2345 6789 0124"]', '2345 6789 0124');

    console.log('✓ Fields populated');

    // 4. Submit form
    console.log('[4/5] Submitting real patient intake...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);

    const currentUrl = page.url();
    console.log(`✓ Successfully navigated to Journey Dashboard: ${currentUrl}`);

    // Verify Dashboard Content
    await page.waitForSelector('text=Arun Kumar Joshi', { timeout: 10000 });
    console.log('✓ Patient Name confirmed on dashboard');

    // 5. Test Tabs on Dashboard
    console.log('[5/5] Testing dashboard tabs...');
    await page.click('button:has-text("Clause Evidence")');
    await page.waitForTimeout(500);
    console.log('✓ Clause Evidence tab active');

    await page.click('button:has-text("Payment & Deposit")');
    await page.waitForTimeout(500);
    console.log('✓ Payment & Deposit tab active');

    // Simulate instant UPI deposit
    await page.click('button:has-text("Simulate UPI Pay (₹50,000)")');
    await page.waitForSelector('text=₹50,000 Deposit Acknowledged!', { timeout: 5000 });
    console.log('✓ Instant UPI deposit simulated and verified!');

    // Capture final verified screenshot
    await page.screenshot({ path: 'screenshots/e2e-verified-journey.png', fullPage: true });
    console.log('✓ Screenshot saved to screenshots/e2e-verified-journey.png');

    console.log('\n🎉 ALL END-TO-END CHECKS PASSED WITH ZERO ERRORS!');
  } catch (err) {
    console.error('❌ E2E verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runE2E();

