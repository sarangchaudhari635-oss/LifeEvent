import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

const startPos = code.indexOf('class cA{');
if (startPos !== -1) {
  // Extract 15000 chars of class cA
  const snippet = code.substring(startPos, startPos + 25000);
  fs.writeFileSync('screenshots/cA-fluid-engine.js', snippet);
  console.log('Saved 25KB of cA fluid engine to screenshots/cA-fluid-engine.js');
} else {
  console.log('class cA not found');
}

