import fs from 'fs';
import path from 'path';

function walk(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(filepath, filelist);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walk('frontend/src');
const linkMatches = [];
const uniqueHrefs = new Map();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf-8');
  const regex = /href=(?:["']([^"']+)["']|{`([^`]+)`})/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const val = match[1] || match[2];
    linkMatches.push({ file: f, href: val });
    if (!uniqueHrefs.has(val)) {
      uniqueHrefs.set(val, []);
    }
    uniqueHrefs.get(val).push(f);
  }
  
  // also check window.open or window.location or router.push
  const navRegex = /(?:window\.location(?:\.href)?\s*=\s*|router\.push\(|window\.open\()['"`]([^'"`]+)['"`]/g;
  while ((match = navRegex.exec(content)) !== null) {
    const val = match[1];
    linkMatches.push({ file: f, href: val });
    if (!uniqueHrefs.has(val)) {
      uniqueHrefs.set(val, []);
    }
    uniqueHrefs.get(val).push(f);
  }
}

console.log(`Total unique links/hrefs found: ${uniqueHrefs.size}`);
for (const [href, files] of Array.from(uniqueHrefs.entries()).sort()) {
  console.log(`\nLINK: ${href} (found in ${files.length} place(s))`);
  for (const f of files) {
    console.log(`  - ${f}`);
  }
}
