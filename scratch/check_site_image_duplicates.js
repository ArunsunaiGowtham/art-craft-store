const fs = require('fs');
const path = require('path');

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

console.log('--- ALL SITE IMAGE USAGE ---');
const used = new Map();

function track(type, id, title, img) {
  if (!used.has(img)) {
    used.set(img, []);
  }
  used.get(img).push(`${type} ${id}: "${title}"`);
}

window.AppData.products.forEach(p => track('Product', p.id, p.name, p.image));
window.AppData.workshops.forEach(w => track('Workshop', w.id, w.title, w.image));
window.AppData.blogPosts.forEach(b => track('Blog', b.id, b.title, b.image));

let duplicates = 0;
for (const [img, items] of used.entries()) {
  if (items.length > 1) {
    duplicates++;
    console.log(`❌ SHARED IMAGE: ${img}`);
    items.forEach(it => console.log(`   - ${it}`));
  }
}

if (duplicates === 0) {
  console.log('🎉 ZERO shared images across the entire website!');
} else {
  console.log(`\nFound ${duplicates} shared images!`);
}
