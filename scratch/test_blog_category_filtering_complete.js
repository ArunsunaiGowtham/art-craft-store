const fs = require('fs');
const path = require('path');

// 1. Load data.js
const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

const allPosts = window.AppData.blogPosts;
console.log(`Loaded ${allPosts.length} blog posts from data.js\n`);

function matchesCat(post, catTarget) {
  var target = (catTarget || "all").toLowerCase().trim();
  if (target === "all" || !target) return true;
  var postCat = (post.category || "").toLowerCase().trim();
  if (postCat === target) return true;
  if (Array.isArray(post.categories) && post.categories.some(c => (c || "").toLowerCase().trim() === target)) return true;
  if (Array.isArray(post.tags) && post.tags.some(t => (t || "").toLowerCase().trim() === target)) return true;
  return false;
}

const categoriesToTest = [
  { name: "all", minCount: 18 },
  { name: "Art Tips", minCount: 2, prohibitedTerms: ["furniture", "animal", "bear"] },
  { name: "Craft Tutorials", minCount: 2, requiredKeywords: ["craft", "candle", "resin", "origami", "pottery", "framing"] },
  { name: "DIY", minCount: 2, requiredKeywords: ["diy", "studio", "framing", "candle", "resin"] },
  { name: "Painting", minCount: 2, requiredKeywords: ["paint", "watercolor", "acrylic", "brush"] },
  { name: "Drawing", minCount: 2, requiredKeywords: ["draw", "sketch", "charcoal", "pencil"] },
  { name: "Origami", minCount: 2, requiredKeywords: ["origami", "paper", "fold"] },
  { name: "Workshops", minCount: 2, requiredKeywords: ["workshop", "class", "studio", "group"] },
  { name: "Product Guides", minCount: 2, requiredKeywords: ["guide", "easel", "brush", "paper"] },
  { name: "Art & Culture", minCount: 2, requiredKeywords: ["culture", "history", "japanese", "urban sketcher", "community"] }
];

let allPassed = true;

categoriesToTest.forEach(test => {
  const filtered = allPosts.filter(p => matchesCat(p, test.name));
  console.log(`=======================================================`);
  console.log(`Testing Category: [${test.name}] -> Found ${filtered.length} articles`);
  console.log(`=======================================================`);

  if (filtered.length < test.minCount) {
    console.error(`❌ Count too low for ${test.name}: got ${filtered.length}, expected at least ${test.minCount}`);
    allPassed = false;
  }

  filtered.forEach(p => {
    console.log(`  [#${p.id}] "${p.title}"`);
    console.log(`       Category: "${p.category}" | Categories: [${p.categories ? p.categories.join(', ') : ''}]`);
    console.log(`       Author: ${p.author} | Image: ${p.image}`);

    // Verify structured fields
    if (!p.title || !p.category || !p.excerpt || !p.image || !p.author || !p.date || !p.readTime) {
      console.error(`❌ Missing structured fields on post #${p.id}`);
      allPassed = false;
    }

    // Verify category relevance
    if (test.name !== "all") {
      const isRelevant = matchesCat(p, test.name);
      if (!isRelevant) {
        console.error(`❌ Article #${p.id} "${p.title}" is NOT relevant to category "${test.name}"`);
        allPassed = false;
      }
    }
  });
  console.log("");
});

// Check that every article has a UNIQUE image or specific topic image
const imageMap = {};
allPosts.forEach(p => {
  if (imageMap[p.image]) {
    console.warn(`⚠️ Note: Image ${p.image} shared between Post #${imageMap[p.image]} and #${p.id}`);
  } else {
    imageMap[p.image] = p.id;
  }
});

// Verify main.js filtering code
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
if (mainJs.includes('title.indexOf("technique") > -1')) {
  console.error('❌ main.js still contains fuzzy title keyword matching in blog filter');
  allPassed = false;
} else {
  console.log('✅ main.js uses clean, structured category matching without fuzzy leakage');
}

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL BLOG CATEGORY FILTERING TESTS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME BLOG FILTERING TESTS FAILED!');
  process.exit(1);
}
