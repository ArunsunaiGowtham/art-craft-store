const fs = require('fs');
const path = require('path');

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

const origamiPosts = window.AppData.blogPosts.filter(p => 
  p.category.toLowerCase() === 'origami' || 
  (p.categories && p.categories.some(c => c.toLowerCase() === 'origami'))
);

console.log(`Origami filtered blog posts count: ${origamiPosts.length}`);
origamiPosts.forEach((p, idx) => {
  console.log(`\n[Article ${idx + 1}] ID: ${p.id}`);
  console.log(`  Title: ${p.title}`);
  console.log(`  Category: ${p.category}`);
  console.log(`  Image: ${p.image}`);
  console.log(`  Image Exists locally: ${fs.existsSync(path.join(__dirname, '..', p.image))}`);
});
