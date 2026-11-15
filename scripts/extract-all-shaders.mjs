import fs from 'fs';

const code = fs.readFileSync('screenshots/nothin-main.js', 'utf8');

function extractShader(varName) {
  const p1 = code.indexOf(varName + '=`');
  if (p1 !== -1) {
    const p2 = code.indexOf('`', p1 + varName.length + 2);
    return code.substring(p1 + varName.length + 2, p2);
  }
  return null;
}

const shaders = {
  K1: extractShader('K1'),
  Z1: extractShader('Z1'),
  J1: extractShader('J1'),
  Q1: extractShader('Q1'),
  eA: extractShader('eA'),
  j1: extractShader('j1'),
  tA: extractShader('tA'),
  nA: extractShader('nA'),
  iA: extractShader('iA'),
  rA: extractShader('rA')
};

fs.writeFileSync('screenshots/all-fluid-shaders.json', JSON.stringify(shaders, null, 2));
console.log('Saved all fluid shaders:');
for (const [k, v] of Object.entries(shaders)) {
  console.log(k + ': ' + (v ? v.length + ' chars' : 'NOT FOUND'));
}

