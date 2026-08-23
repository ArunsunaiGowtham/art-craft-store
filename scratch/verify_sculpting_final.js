const fs = require('fs');
global.window = global;
eval(fs.readFileSync('js/data.js', 'utf8'));

const sculptingProds = window.AppData.products.filter(p => p.category === 'sculpting');
console.log('=== Sculpting Products Verification ===');
sculptingProds.forEach(p => {
  let exists = true;
  let sz = 'Remote URL';
  if (!p.image.startsWith('http')) {
    exists = fs.existsSync(p.image);
    if (exists) sz = fs.statSync(p.image).size + ' bytes';
  }
  console.log(`[ID ${p.id}] ${p.name}`);
  console.log(`       Path:   ${p.image}`);
  console.log(`       Status: ${exists ? 'EXISTS' : 'MISSING'} (${sz})`);
});
