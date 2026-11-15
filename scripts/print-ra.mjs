import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

const idx = code.indexOf('rA=`');
if (idx !== -1) {
  const endIdx = code.indexOf('`', idx + 4);
  console.log('=== FULL rA SHADER ===');
  console.log(code.substring(idx + 4, endIdx));
}

