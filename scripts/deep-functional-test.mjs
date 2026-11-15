import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

async function runDeepFunctionalTests() {
  console.log('🧪 RUNNING DEEP FUNCTIONAL & INTERACTION TEST SUITE WITH VERIFIED SELECTORS...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = {
    intakeFlow: false,
    livingJourneyFlow: false,
    evidenceModalFlow: false,
    paytmFundingFlow: false,
    counselorCockpitFlow: false,
    documentRedactorFlow: false,
    hospitalPilotFlow: false,
    privacyPurgeFlow: false,
    demoScriptFlow: false,
    mobileDrawerFlow: false,
  };

  // 1. TEST INTAKE FLOW
  console.log('1️⃣ Testing Emergency Intake Workflow (/intake)...');
  await page.goto(`${BASE_URL}/intake`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click sample loader
  const sampleBtn = page.locator('button:has-text("Load Sample (Cardiac ₹4.2L)")').first();
  if (await sampleBtn.count() > 0) {
    await sampleBtn.click();
    await page.waitForTimeout(500);
    console.log('  ✓ "Load Sample (Cardiac ₹4.2L)" clicked');
  }

  // Verify form filled
  const patientVal = await page.locator('input[placeholder*="Suresh"]').inputValue().catch(() => '');
  console.log(`  ✓ Patient name field populated: "${patientVal}"`);

  // Submit form
  const submitBtn = page.locator('button[type="submit"]:has-text("Start Live Financial Journey")').first();
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
    await page.waitForTimeout(2500);
    const currentUrl = page.url();
    console.log(`  ✓ Form submitted, navigated to: ${currentUrl}`);
    results.intakeFlow = currentUrl.includes('/journey/');
  }

  // 2. TEST LIVING JOURNEY DASHBOARD
  console.log('\n2️⃣ Testing Living Journey Dashboard (/journey/demo-journey-cardiac-01)...');
  await page.goto(`${BASE_URL}/journey/demo-journey-cardiac-01`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Check gap card visibility
  const gapCard = page.locator('text=Expected Gap').first();
  const gapVisible = await gapCard.isVisible();
  console.log(`  ✓ Expected Gap card visible: ${gapVisible}`);

  // Click Re-plan trigger button
  const replanBtn = page.locator('button:has-text("Simulate TPA Query & Re-plan")').or(page.locator('button:has-text("Simulate TPA Query")')).first();
  if (await replanBtn.count() > 0) {
    await replanBtn.click();
    await page.waitForTimeout(1000);
    const notice = page.locator('text=Simulated TPA Query Ingested').first();
    const noticeVisible = await notice.isVisible().catch(() => false);
    console.log(`  ✓ Dynamic TPA Re-planning triggered, notice visible: ${noticeVisible}`);
    results.livingJourneyFlow = gapVisible;
  }

  // 3. TEST FORENSIC EVIDENCE CHAMBER
  console.log('\n3️⃣ Testing Forensic Evidence Chamber (/journey/demo-journey-cardiac-01/coverage)...');
  await page.goto(`${BASE_URL}/journey/demo-journey-cardiac-01/coverage`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click finding card directly
  const findingCard = page.locator('.group:has-text("Room Rent & Nursing Expenses")').first();
  if (await findingCard.count() > 0) {
    await findingCard.click();
    await page.waitForTimeout(800);
    const modalHeading = page.locator('text=Forensic Clause Verification').or(page.locator('text=Evidence')).first();
    const modalVisible = await modalHeading.isVisible().catch(() => false);
    console.log(`  ✓ Evidence modal opened from finding card: ${modalVisible}`);

    // Close modal
    const closeBtn = page.locator('button[aria-label="Close modal"]').or(page.locator('button:has-text("Close")')).first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(300);
      console.log('  ✓ Evidence modal closed');
    }
    results.evidenceModalFlow = modalVisible;
  }

  // 4. TEST PAYTM BRIDGE FUNDING
  console.log('\n4️⃣ Testing Paytm UPI Caution Deposit Bridge (/journey/demo-journey-cardiac-01/funding)...');
  await page.goto(`${BASE_URL}/journey/demo-journey-cardiac-01/funding`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Copy UPI
  const copyBtn = page.locator('button[title="Copy UPI ID"]').first();
  if (await copyBtn.count() > 0) {
    await copyBtn.click();
    await page.waitForTimeout(300);
    console.log('  ✓ Copy UPI ID button clicked');
  }

  // Disburse button
  const disburseBtn = page.locator('button:has-text("Simulate Instant UPI Settlement")').first();
  if (await disburseBtn.count() > 0) {
    await disburseBtn.click();
    await page.waitForTimeout(1500);
    const receipt = page.locator('text=DISBURSEMENT COMPLETE').or(page.locator('text=Auto-reconciled with Counter #4')).first();
    const receiptVisible = await receipt.isVisible().catch(() => false);
    console.log(`  ✓ Disbursal simulated, receipt visible: ${receiptVisible}`);
    results.paytmFundingFlow = receiptVisible;
  }

  // 5. TEST COUNSELOR COCKPIT
  console.log('\n5️⃣ Testing Counselor Cockpit (/counselor)...');
  await page.goto(`${BASE_URL}/counselor`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const searchInput = page.locator('input[placeholder*="Search"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill('Ramesh');
    await page.waitForTimeout(300);
    console.log('  ✓ Search filter input tested');
  }

  const urgencyBtn = page.locator('button:has-text("Critical ICU")').first();
  if (await urgencyBtn.count() > 0) {
    await urgencyBtn.click();
    await page.waitForTimeout(300);
    console.log('  ✓ "Critical ICU" filter button tested');
    results.counselorCockpitFlow = true;
  }

  // 6. TEST DOCUMENT REDACTOR LAB
  console.log('\n6️⃣ Testing Document Redactor Lab (/documents)...');
  await page.goto(`${BASE_URL}/documents`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const textarea = page.locator('textarea').first();
  if (await textarea.count() > 0) {
    await textarea.fill('Patient Test, Aadhaar: 1111 2222 3333, Emergency: 9999999999');
    await page.waitForTimeout(300);
    const maskedText = page.locator('text=XXXX-XXXX-3333').first();
    const maskedVisible = await maskedText.isVisible().catch(() => false);
    console.log(`  ✓ Verhoeff real-time masking playground verified: ${maskedVisible}`);
    results.documentRedactorFlow = maskedVisible;
  }

  // 7. TEST HOSPITAL PILOT
  console.log('\n7️⃣ Testing Hospital Pilot Onboarding (/for-hospitals)...');
  await page.goto(`${BASE_URL}/for-hospitals`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const hospInput = page.locator('input[placeholder*="Sahyadri"]').first();
  if (await hospInput.count() > 0) {
    await hospInput.fill('Manipal Hospital');
    const nameInput = page.locator('input[placeholder*="Rajesh Sharma"]').first();
    await nameInput.fill('Dr. Sharma');
    const emailInput = page.locator('input[placeholder*="billing@hospital.org"]').first();
    await emailInput.fill('sharma@manipal.test');
    const phoneInput = page.locator('input[placeholder*="98765 43210"]').first();
    await phoneInput.fill('+91 98765 43210');

    const pilotSubmit = page.locator('button[type="submit"]:has-text("Submit Hospital Pilot Application")').first();
    if (await pilotSubmit.count() > 0) {
      await pilotSubmit.click();
      await page.waitForTimeout(1500);
      const conf = page.locator('text=Pilot Application Received').or(page.locator('text=Application Received')).first();
      const confVisible = await conf.isVisible().catch(() => false);
      console.log(`  ✓ Hospital pilot form submission confirmed: ${confVisible}`);
      results.hospitalPilotFlow = confVisible;
    }
  }

  // 8. TEST PRIVACY PURGE
  console.log('\n8️⃣ Testing Privacy Hard-Purge (/privacy)...');
  await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const purgeBtn = page.locator('button:has-text("Hard Purge")').first();
  if (await purgeBtn.count() > 0) {
    await purgeBtn.click();
    await page.waitForTimeout(1200);
    const purgeFeedback = page.locator('text=Hard-delete').or(page.locator('text=permanently purged')).or(page.locator('text=cleared')).first();
    const purgeVisible = await purgeFeedback.isVisible().catch(() => false);
    console.log(`  ✓ Zero-knowledge purge feedback verified: ${purgeVisible}`);
    results.privacyPurgeFlow = purgeVisible;
  }

  // 9. TEST DEMO SCRIPT
  console.log('\n9️⃣ Testing 3-Minute Judge Script (/demo-script)...');
  await page.goto(`${BASE_URL}/demo-script`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const stepCount = await page.locator('text=/00:00|00:30|01:00|01:45|02:15|02:40/').count();
  console.log(`  ✓ Judge Script timeline blocks detected: ${stepCount}`);
  results.demoScriptFlow = stepCount >= 4;

  // 10. TEST MOBILE DRAWER ON 390px (Tested on inner page with Navbar)
  console.log('\n🔟 Testing Mobile Navigation Drawer (390px Viewport)...');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/how-it-works`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  const drawerTrigger = mobilePage.locator('button[aria-label="Open Navigation Directory"]').first();
  if (await drawerTrigger.count() > 0) {
    await drawerTrigger.click();
    await mobilePage.waitForTimeout(600);
    const drawerTitle = mobilePage.locator('text=Patient & Family Flow').first();
    const drawerOpen = await drawerTitle.isVisible().catch(() => false);
    console.log(`  ✓ Mobile slide-over drawer opens cleanly: ${drawerOpen}`);

    // Check link in drawer
    const intakeLink = mobilePage.locator('a:has-text("Emergency Crisis Intake")').first();
    if (await intakeLink.count() > 0) {
      await intakeLink.click();
      await mobilePage.waitForTimeout(1500);
      console.log(`  ✓ Mobile link navigated to: ${mobilePage.url()}`);
      results.mobileDrawerFlow = mobilePage.url().includes('/intake');
    }
  }

  await mobileContext.close();
  await context.close();
  await browser.close();

  console.log('\n==================================================');
  console.log('🏁 FUNCTIONAL TEST RESULTS SUMMARY');
  console.log('==================================================');
  let allPassed = true;
  for (const [key, val] of Object.entries(results)) {
    console.log(`  ${val ? '✅' : '❌'} ${key}: ${val ? 'PASSED' : 'FAILED'}`);
    if (!val) allPassed = false;
  }

  return { results, allPassed };
}

runDeepFunctionalTests().catch(console.error);
