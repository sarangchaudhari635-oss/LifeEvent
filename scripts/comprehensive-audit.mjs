import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

const ROUTES = [
  '/',
  '/intake',
  '/counselor',
  '/for-hospitals',
  '/journey/demo-journey-cardiac-01',
  '/journey/demo-journey-cardiac-01/coverage',
  '/journey/demo-journey-cardiac-01/funding',
  '/documents',
  '/how-it-works',
  '/privacy',
  '/demo-script',
];

const VIEWPORTS = [
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
  { name: 'Laptop (1280px)', width: 1280, height: 800 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Mobile (390px)', width: 390, height: 844 },
];

async function runAudit() {
  console.log('🚀 STARTING COMPREHENSIVE PRE-LAUNCH AUDIT...\n');

  const browser = await chromium.launch({ headless: true });
  const report = {
    testedRoutes: ROUTES.length,
    viewportsTested: VIEWPORTS.length,
    consoleErrors: [],
    consoleWarnings: [],
    failedRequests: [],
    overflowBugs: [],
    deadLinks: [],
    buttonErrors: [],
  };

  for (const vp of VIEWPORTS) {
    console.log(`\n==================================================`);
    console.log(`📐 TESTING VIEWPORT: ${vp.name}`);
    console.log(`==================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent:
        vp.width < 768
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      // Filter harmless dev warnings
      if (type === 'error') {
        report.consoleErrors.push({ viewport: vp.name, url: page.url(), text });
        console.error(`  ❌ [Console Error] [${vp.name}] ${text.slice(0, 140)}`);
      } else if (type === 'warning') {
        report.consoleWarnings.push({ viewport: vp.name, url: page.url(), text });
      }
    });

    page.on('pageerror', (err) => {
      report.consoleErrors.push({
        viewport: vp.name,
        url: page.url(),
        text: `Uncaught Page Error: ${err.message}`,
      });
      console.error(`  💥 [Page Exception] [${vp.name}] ${err.message}`);
    });

    page.on('requestfailed', (req) => {
      // Ignore aborts
      if (req.failure()?.errorText !== 'net::ERR_ABORTED') {
        report.failedRequests.push({
          viewport: vp.name,
          url: page.url(),
          reqUrl: req.url(),
          error: req.failure()?.errorText,
        });
        console.error(`  ⚠️ [Failed Request] [${vp.name}] ${req.url()} - ${req.failure()?.errorText}`);
      }
    });

    for (const route of ROUTES) {
      const fullUrl = `${BASE_URL}${route}`;
      try {
        const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const status = response ? response.status() : 'no-response';
        
        await page.waitForTimeout(800);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          return {
            hasOverflow: docWidth > winWidth + 2, // 2px tolerance for subpixel rounding
            docWidth,
            winWidth,
          };
        });

        if (overflow.hasOverflow) {
          report.overflowBugs.push({
            viewport: vp.name,
            route,
            scrollWidth: overflow.docWidth,
            innerWidth: overflow.winWidth,
          });
          console.warn(`  ⚠️ [Horizontal Overflow] [${vp.name}] on ${route}: scrollWidth=${overflow.docWidth}px vs innerWidth=${overflow.winWidth}px`);
        }

        console.log(`  ✓ Route loaded: ${route} (status: ${status})`);
      } catch (err) {
        console.error(`  ❌ Failed to load route ${route}:`, err.message);
        report.deadLinks.push({ viewport: vp.name, route, error: err.message });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log('\n==================================================');
  console.log('📊 AUDIT SUMMARY REPORT');
  console.log('==================================================');
  console.log(`Total Routes Tested: ${report.testedRoutes}`);
  console.log(`Total Viewports: ${report.viewportsTested}`);
  console.log(`Total Console Errors: ${report.consoleErrors.length}`);
  console.log(`Total Failed Network Requests: ${report.failedRequests.length}`);
  console.log(`Total Horizontal Overflow Bugs: ${report.overflowBugs.length}`);
  console.log(`Total Dead Routes: ${report.deadLinks.length}`);

  return report;
}

runAudit().catch(console.error);
