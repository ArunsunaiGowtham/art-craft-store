const fs = require('fs');

const dataCode = fs.readFileSync('js/data.js', 'utf8');
const mainCode = fs.readFileSync('js/main.js', 'utf8');

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    documentElement: { setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => []
  }
};

eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));

const blogPosts = sandbox.window.AppData.blogPosts;

console.log("=== VALIDATING NEW WATERCOLOR BLOG ARTICLE ===");

// 1. Total posts count
console.log(`Total blog posts in catalog: ${blogPosts.length}`);
let pass1 = blogPosts.length === 9;
console.log(`[${pass1 ? "PASS" : "FAIL"}] Total blog posts count is 9 (completing 3x3 grid)`);

// 2. Article #9 exact metadata matching
const post9 = blogPosts.find(p => p.id === 9);
let pass2 = post9 &&
            post9.category === "Painting" &&
            post9.title === "Watercolor Painting for Beginners: A Simple Guide to Your First Painting" &&
            post9.excerpt === "Learn the essential watercolor techniques, materials, and simple steps you need to create your first beautiful watercolor painting." &&
            post9.readTime === "6 min read" &&
            post9.author === "Emily Rodriguez" &&
            post9.date === "2026-06-12";
console.log(`[${pass2 ? "PASS" : "FAIL"}] Article #9 metadata matches exact user specification`);

// 3. Image uniqueness
const images = blogPosts.map(p => p.image);
const uniqueImages = new Set(images);
let pass3 = images.length === uniqueImages.size;
console.log(`[${pass3 ? "PASS" : "FAIL"}] All 9 blog article images are 100% unique`);

// 4. Painting category filtering
const paintingPosts = blogPosts.filter(p => p.category === "Painting" || (p.categories && p.categories.includes("Painting")));
let pass4 = paintingPosts.some(p => p.id === 9);
console.log(`[${pass4 ? "PASS" : "FAIL"}] Painting category correctly includes article #9 (Total painting matches: ${paintingPosts.length})`);

// 5. Coherent article content check
let pass5 = post9 && post9.content.includes("Watercolor painting") && post9.content.includes("wet-on-wet") && post9.content.split('\n\n').length >= 3;
console.log(`[${pass5 ? "PASS" : "FAIL"}] Article has rich, coherent watercolor tutorial content (${post9.content.split('\n\n').length} paragraphs)`);

if (pass1 && pass2 && pass3 && pass4 && pass5) {
  console.log("\nALL BLOG ARTICLE #9 VALIDATIONS PASSED!");
} else {
  process.exit(1);
}
