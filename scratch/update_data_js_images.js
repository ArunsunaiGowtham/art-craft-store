const fs = require('fs');

let content = fs.readFileSync('js/data.js', 'utf8');

const updates = [
  { id: 2, image: 'images/product-acrylic-paint-set.jpg' },
  { id: 13, image: 'images/blog-resin-art-casting.jpg' },
  { id: 16, image: 'images/product-calligraphy-pen-set.jpg' },
  { id: 17, image: 'images/product-student-complete-art-kit.jpg' },
  { id: 20, image: 'images/product-professional-brush-set.jpg' },
  { id: 21, image: 'images/blog-product-guide-wooden-easel.jpg' },
  { id: 29, image: 'images/blog-product-guide-palette-set.jpg' },
  { id: 33, image: 'images/product-oil-color-master-set.jpg' }
];

// Verify we can evaluate
let window = {};
eval(content);

// Let's replace each product's image line
for (const update of updates) {
  const prod = window.AppData.products.find(p => p.id === update.id);
  if (!prod) {
    console.error(`Product ID ${update.id} not found!`);
    process.exit(1);
  }
  const oldImage = prod.image;
  console.log(`Updating ID ${update.id} ("${prod.name}"):\n  OLD: ${oldImage}\n  NEW: ${update.image}`);
  
  // Find regex for `id: <id>, ... image: "<oldImage>"`
  // We can do a string replace of the exact image URL for that product
  if (!content.includes(oldImage)) {
    console.error(`Image URL ${oldImage} not found in data.js!`);
    process.exit(1);
  }
  content = content.replace(oldImage, update.image);
}

fs.writeFileSync('js/data.js', content);
console.log("\nSUCCESS: Updated js/data.js with exact matching product images!");
