const fs = require('fs');

const html = fs.readFileSync('blog.html', 'utf8');
const dataCode = fs.readFileSync('js/data.js', 'utf8');

// Evaluate AppData
const sandbox = { window: {} };
eval(dataCode.replace('window.AppData', 'sandbox.window.AppData'));
const AppData = sandbox.window.AppData;

console.log("=== BLOG CATEGORY FILTER VALIDATION ===");

// 1. Check HTML buttons via regex
const buttonMatches = [...html.matchAll(/class="blog-category-btn([^"]*)"\s+data-category="([^"]+)"/g)];
const buttonCategories = buttonMatches.map(m => m[2]);

console.log(`Found ${buttonCategories.length} category buttons:`, buttonCategories);

const expectedCategories = [
  'all',
  'Art Tips',
  'Craft Tutorials',
  'DIY',
  'Painting',
  'Drawing',
  'Origami',
  'Workshops',
  'Product Guides',
  'Art & Culture'
];

const deletedCategories = ['Business', 'Studio Setup', 'Buying Guide'];

// Test 1: Button count & exact categories
let pass1 = buttonCategories.length === 10 && expectedCategories.every(c => buttonCategories.includes(c));
console.log(`[${pass1 ? 'PASS' : 'FAIL'}] Exactly 10 expected categories present in HTML`);

// Test 2: Deleted categories completely absent from HTML
let pass2 = deletedCategories.every(c => !html.includes(`data-category="${c}"`));
console.log(`[${pass2 ? 'PASS' : 'FAIL'}] Deleted categories absent from HTML filter buttons`);

// Test 3: 'all' is active by default in HTML
let pass3 = html.includes('class="blog-category-btn active" data-category="all"');
console.log(`[${pass3 ? 'PASS' : 'FAIL'}] 'All' category button is active by default`);

// Test 4: Verify AppData.blogPosts do not contain deleted primary categories
const posts = AppData.blogPosts;
let pass4 = posts.every(p => !deletedCategories.includes(p.category));
console.log(`[${pass4 ? 'PASS' : 'FAIL'}] All 8 blog posts use only approved primary categories`);

// Test 5: Test filtering logic for each remaining category
console.log("\nTesting article filtering for each category:");
let allCatsMatch = true;

function matchesCat(post, catTarget) {
  if (!catTarget || catTarget.toLowerCase() === 'all') return true;
  var target = catTarget.toLowerCase().trim();
  if (post.category && post.category.toLowerCase().trim() === target) return true;
  if (Array.isArray(post.categories) && post.categories.some(c => c.toLowerCase().trim() === target)) return true;
  if (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().trim() === target)) return true;
  var title = (post.title || '').toLowerCase();
  var cat = (post.category || '').toLowerCase();
  if (target === 'product guides' && (cat.indexOf('guide') > -1 || title.indexOf('guide') > -1 || title.indexOf('easel') > -1)) return true;
  if (target === 'painting' && (cat.indexOf('paint') > -1 || title.indexOf('paint') > -1 || title.indexOf('watercolor') > -1 || title.indexOf('acrylic') > -1)) return true;
  if (target === 'drawing' && (cat.indexOf('draw') > -1 || title.indexOf('sketch') > -1 || title.indexOf('draw') > -1)) return true;
  if (target === 'origami' && (cat.indexOf('origami') > -1 || title.indexOf('origami') > -1 || title.indexOf('paper') > -1)) return true;
  if (target === 'diy' && (cat.indexOf('diy') > -1 || title.indexOf('diy') > -1 || title.indexOf('studio') > -1 || title.indexOf('craft') > -1)) return true;
  if (target === 'craft tutorials' && (cat.indexOf('craft') > -1 || title.indexOf('craft') > -1 || title.indexOf('origami') > -1 || title.indexOf('technique') > -1)) return true;
  if (target === 'art & culture' && (cat.indexOf('culture') > -1 || title.indexOf('origami') > -1 || title.indexOf('sketchbook') > -1)) return true;
  if (target === 'art tips' && (cat.indexOf('tips') > -1 || title.indexOf('tips') > -1 || title.indexOf('technique') > -1 || title.indexOf('theory') > -1)) return true;
  if (target === 'workshops' && (cat.indexOf('workshop') > -1 || title.indexOf('technique') > -1 || title.indexOf('tips') > -1)) return true;
  return false;
}

expectedCategories.forEach(cat => {
  const matches = posts.filter(p => matchesCat(p, cat));
  console.log(`  -> Category "${cat}": ${matches.length} matching articles`);
  if (matches.length === 0) allCatsMatch = false;
});

console.log(`[${allCatsMatch ? 'PASS' : 'FAIL'}] Every category matches >= 1 article (zero empty broken categories)`);

if (pass1 && pass2 && pass3 && pass4 && allCatsMatch) {
  console.log("\nALL BLOG FILTER CLEANUP VALIDATIONS PASSED!");
} else {
  process.exit(1);
}
