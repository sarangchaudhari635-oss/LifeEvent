import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

function findSnippetAround(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*[\`"']`, 'g');
  const match = re.exec(code);
  if (match) {
    const start = match.index;
    console.log(`=== SHADER ${name} ===`);
    console.log(code.substring(start, start + 600));
  } else {
    // try finding where name is defined
    const idx = code.indexOf(name + '=`');
    if (idx !== -1) {
      console.log(`=== SHADER ${name} (template literal) ===`);
      console.log(code.substring(idx, idx + 600));
    } else {
      console.log(`Shader ${name} not found by regex`);
    }
  }
}

findSnippetAround('rA');
findSnippetAround('J1');
findSnippetAround('j1');
findSnippetAround('Q1');

