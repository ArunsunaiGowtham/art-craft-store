const fs = require('fs');
global.window = {};
global.document = { addEventListener: () => {} };
eval(fs.readFileSync('./js/data.js', 'utf8'));

const products = global.window.AppData.products;
console.log("=== ALL PRODUCTS ===");
products.forEach(p => {
    console.log(`ID ${p.id}: "${p.name}" ($${p.price}) [${p.category}] -> ${p.image}`);
});
