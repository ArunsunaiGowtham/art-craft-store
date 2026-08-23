const fs = require('fs');
const path = require('path');

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

console.log('=== WORKSHOPS AUDIT (12 WORKSHOPS) ===');
window.AppData.workshops.forEach(w => {
  console.log(`[WS ${w.id}] "${w.title}" | Category: ${w.category}`);
  console.log(`   Instructor: ${w.instructor} | Level: ${w.level}`);
  console.log(`   Image: ${w.image}`);
  console.log(`   Local file exists: ${fs.existsSync(path.join(__dirname, '..', w.image))}`);
});

console.log('\n=== BLOG POSTS AUDIT (19 POSTS) ===');
window.AppData.blogPosts.forEach(b => {
  console.log(`[Blog ${b.id}] "${b.title}" | Category: ${b.category} (${(b.categories||[]).join(', ')})`);
  console.log(`   Image: ${b.image}`);
  console.log(`   Local file exists: ${fs.existsSync(path.join(__dirname, '..', b.image))}`);
});
