const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
global.window = {};
eval(dataJs);

const posts = global.window.AppData.blogPosts;
const diyPosts = posts.filter(p => p.category === 'DIY' || (p.categories && p.categories.includes('DIY')));

console.log('DIY Blog Posts count:', diyPosts.length);
diyPosts.forEach(p => {
  console.log(`- ID: ${p.id} | "${p.title}" | Image: ${p.image}`);
});

const images = diyPosts.map(p => p.image);
const unique = new Set(images);
if (unique.size === diyPosts.length) {
  console.log('✅ ALL DIY BLOG POST IMAGES ARE 100% UNIQUE!');
} else {
  console.error('❌ REPEATED IMAGES DETECTED IN DIY BLOG POSTS!');
  process.exit(1);
}
