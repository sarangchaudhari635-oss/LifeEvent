#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const targetUrl = process.argv[2] || 'verification-test/index.html';
const outDir = resolve(process.cwd(), 'screenshots');

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// Convert local relative file path to file:// URL if needed
let resolvedUrl = targetUrl;
if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('file://')) {
  resolvedUrl = `file:///${resolve(process.cwd(), targetUrl).replace(/\\/g, '/')}`;
}

console.log(`\n============================================================`);
console.log(`📸 VISUAL QA AUTOMATION RUNNER`);
console.log(`Target: ${resolvedUrl}`);
console.log(`Output: ${outDir}`);
console.log(`============================================================\n`);

const viewports = [
  { name: 'desktop-1440', size: '1440, 900', label: 'Desktop (1440px)' },
  { name: 'laptop-1280',  size: '1280, 800', label: 'Laptop (1280px)' },
  { name: 'tablet-768',   size: '768, 1024', label: 'Tablet (768px)' },
  { name: 'mobile-390',   size: '390, 844',  label: 'Mobile (390px)' }
];

for (const vp of viewports) {
  const outPath = resolve(outDir, `${vp.name}.png`);
  console.log(`Capturing ${vp.label} [${vp.size}]...`);
  try {
    const cmd = `npx playwright screenshot --viewport-size="${vp.size}" --full-page "${resolvedUrl}" "${outPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ Saved: screenshots/${vp.name}.png`);
  } catch (err) {
    console.error(`✗ Failed to capture ${vp.label}:`, err.message);
  }
}

console.log(`\n============================================================`);
console.log(`✅ Multi-viewport visual QA capture complete!`);
console.log(`Inspect the results in the screenshots/ directory before proceeding.`);
console.log(`============================================================\n`);

