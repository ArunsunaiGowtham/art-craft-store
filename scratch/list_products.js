const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

// evaluate AppData
let window = {};
eval(content);

console.log("Total products:", window.AppData.products.length);
window.AppData.products.forEach(p => {
  console.log(`ID ${p.id}: ${p.name} ($${p.price})`);
});
