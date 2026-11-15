import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

function findSnippets(term) {
  let idx = 0;
  console.log('=== SNIPPETS FOR ' + term + ' ===');
  while (true) {
    const pos = code.indexOf(term, idx);
    if (pos === -1) break;
    console.log(code.substring(Math.max(0, pos - 200), Math.min(code.length, pos + 400)));
    console.log('---');
    idx = pos + term.length;
  }
}

findSnippets('nothin-hero-w');
findSnippets('video-hero-bg');
findSnippets('cursor-work');
findSnippets('black-blend');

