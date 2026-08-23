const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

let window = {};
eval(content);

const sculptingProducts = window.AppData.products.filter(p => p.category === 'sculpting');
console.log(`Found ${sculptingProducts.length} sculpting products:`);
sculptingProducts.forEach(p => {
  console.log(`ID ${p.id}: "${p.name}" (Image: ${p.image})`);
});
