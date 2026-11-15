import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

function findSnippets(term, limit = 5) {
  let idx = 0;
  console.log('=== SNIPPETS FOR ' + term + ' ===');
  for (let i = 0; i < limit; i++) {
    const pos = code.indexOf(term, idx);
    if (pos === -1) break;
    console.log(code.substring(Math.max(0, pos - 150), Math.min(code.length, pos + 250)));
    console.log('---');
    idx = pos + term.length;
  }
}

findSnippets('displacement', 3);
findSnippets('feDisplacementMap', 2);
findSnippets('uniform', 4);
findSnippets('createShader', 2);
findSnippets('liquid', 2);

