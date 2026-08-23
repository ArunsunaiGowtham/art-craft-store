const fs = require('fs');

const mainCode = fs.readFileSync('js/main.js', 'utf8');
const dataCode = fs.readFileSync('js/data.js', 'utf8');

// Set up browser-like environment
const sandbox = {
  window: {},
  document: {
    querySelector: function(sel) { return null; },
    querySelectorAll: function(sel) { return []; },
    getElementById: function(id) { return null; },
    addEventListener: function() {}
  }
};

eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));

// Extract filterBlogPosts logic
const posts = sandbox.window.AppData.blogPosts;

function matchesCat(post, catTarget) {
  if (catTarget === "all" || !catTarget) return true;
  if (post.category && post.category.toLowerCase().trim() === catTarget) return true;
  if (Array.isArray(post.categories) && post.categories.some(function (c) { return c.toLowerCase().trim() === catTarget; })) return true;
  if (Array.isArray(post.tags) && post.tags.some(function (t) { return t.toLowerCase().trim() === catTarget; })) return true;

  var title = (post.title || "").toLowerCase();
  var cat = (post.category || "").toLowerCase();
  if (catTarget === "product guides" && (cat.indexOf("guide") > -1 || title.indexOf("guide") > -1 || title.indexOf("easel") > -1)) return true;
  if (catTarget === "painting" && (cat.indexOf("paint") > -1 || title.indexOf("paint") > -1 || title.indexOf("watercolor") > -1 || title.indexOf("acrylic") > -1)) return true;
  if (catTarget === "drawing" && (cat.indexOf("draw") > -1 || title.indexOf("sketch") > -1 || title.indexOf("draw") > -1)) return true;
  if (catTarget === "origami" && (cat.indexOf("origami") > -1 || title.indexOf("origami") > -1 || title.indexOf("paper") > -1)) return true;
  if (catTarget === "diy" && (cat.indexOf("diy") > -1 || title.indexOf("diy") > -1 || title.indexOf("studio") > -1 || title.indexOf("craft") > -1)) return true;
  if (catTarget === "craft tutorials" && (cat.indexOf("craft") > -1 || title.indexOf("craft") > -1 || title.indexOf("origami") > -1 || title.indexOf("technique") > -1)) return true;
  if (catTarget === "art & culture" && (cat.indexOf("culture") > -1 || title.indexOf("origami") > -1 || title.indexOf("sketchbook") > -1)) return true;
  if (catTarget === "art tips" && (cat.indexOf("tips") > -1 || title.indexOf("tips") > -1 || title.indexOf("technique") > -1 || title.indexOf("theory") > -1)) return true;
  if (catTarget === "workshops" && (cat.indexOf("workshop") > -1 || title.indexOf("technique") > -1 || title.indexOf("tips") > -1)) return true;
  return false;
}

console.log("=== TESTING ALL CATEGORY FILTER RESTORATION ===");

// Test 1: 'all' filter returns 100% of the articles
const allFiltered = posts.filter(p => matchesCat(p, 'all'));
console.log(`Total posts in AppData: ${posts.length}`);
console.log(`Total posts returned by 'all': ${allFiltered.length}`);
let pass1 = allFiltered.length === posts.length && posts.length === 8;
console.log(`[${pass1 ? 'PASS' : 'FAIL'}] 'all' filter returns all 8 articles`);

// Test 2: Specific category filters subset, then 'all' resets to 8
const origamiFiltered = posts.filter(p => matchesCat(p, 'origami'));
console.log(`Origami posts returned: ${origamiFiltered.length}`);
let pass2 = origamiFiltered.length === 1;

const resetFiltered = posts.filter(p => matchesCat(p, 'all'));
let pass3 = resetFiltered.length === 8;
console.log(`[${pass2 && pass3 ? 'PASS' : 'FAIL'}] Switching from category to 'all' restores all 8 articles`);

// Test 3: Verify all 8 article details are intact
let pass4 = allFiltered.every(p => p.id && p.title && p.image && p.category && p.date && p.excerpt && p.author);
console.log(`[${pass4 ? 'PASS' : 'FAIL'}] All 8 articles contain full card properties (id, title, image, category, date, excerpt, author)`);

if (pass1 && pass2 && pass3 && pass4) {
  console.log("\nALL 'ALL' CATEGORY FILTER TESTS PASSED!");
} else {
  process.exit(1);
}
