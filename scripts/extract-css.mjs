import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

function findCssRules() {
  const cssMatches = code.match(/\.section-w[\s\S]{1,1500}/);
  if (cssMatches) {
    console.log('=== CSS snippet around .section-w ===');
    console.log(cssMatches[0].substring(0, 800));
  }
}

findCssRules();

