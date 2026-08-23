const fs = require('fs');
const vm = require('vm');

const dataCode = fs.readFileSync('js/data.js', 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataCode, context);

const products = context.window.AppData.products;
console.log(`Total products: ${products.length}\n`);

const categories = new Set();
products.forEach(p => {
  categories.add(p.category);
  console.log(`ID ${p.id.toString().padEnd(2)}: ${p.name.padEnd(35)} | $${p.price.toFixed(2).padEnd(6)} | Cat: ${p.category.padEnd(16)} | Img: ${p.image ? 'OK' : 'MISSING'}`);
});

console.log(`\nUnique categories (${categories.size}):`, Array.from(categories).sort());
