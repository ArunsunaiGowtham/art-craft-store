const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const posts = global.window.AppData.blogPosts;
console.log('Total blog posts:', posts.length);

const imageCounts = {};
posts.forEach(p => {
  console.log(`[Blog ${p.id}] "${p.title}" (${p.category}) -> ${p.image}`);
  imageCounts[p.image] = (imageCounts[p.image] || 0) + 1;
});

console.log('\n--- Duplicate Check in Blog Posts ---');
let hasDupes = false;
Object.keys(imageCounts).forEach(img => {
  if (imageCounts[img] > 1) {
    hasDupes = true;
    const matching = posts.filter(p => p.image === img);
    console.error(`❌ Duplicate Image (${imageCounts[img]} posts): ${img}`);
    matching.forEach(m => console.error(`   - ID ${m.id}: "${m.title}"`));
  }
});

if (!hasDupes) {
  console.log('✅ All blog post images are 100% unique!');
}
