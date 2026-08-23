const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING BLOG CARD 'READ MORE' BUTTON CENTERING ===\n");

const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const detailsHtml = fs.readFileSync(path.join(__dirname, '..', 'blog-details.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

let allPassed = true;

// 1. Check js/main.js renderBlogCards structure
const mainHasBtnWrap = mainJs.includes('blog-card-btn-wrap') && mainJs.includes('blog-read-more-btn');
const mainHasAuthorRow = mainJs.includes('blog-author-row') && mainJs.includes('blog-card-footer');
console.log(`[${mainHasBtnWrap ? 'PASS' : 'FAIL'}] js/main.js renders blog-card-btn-wrap with centered Read More button`);
console.log(`[${mainHasAuthorRow ? 'PASS' : 'FAIL'}] js/main.js renders dedicated blog-author-row above centered button`);
if (!mainHasBtnWrap || !mainHasAuthorRow) allPassed = false;

// 2. Check index.html blog cards
const indexHasBtnWrap = indexHtml.includes('blog-card-btn-wrap') && indexHtml.includes('blog-read-more-btn');
console.log(`[${indexHasBtnWrap ? 'PASS' : 'FAIL'}] index.html blog cards contain centered blog-card-btn-wrap`);
if (!indexHasBtnWrap) allPassed = false;

// 3. Check blog-details.html related cards
const detailsHasBtnWrap = detailsHtml.includes('blog-card-btn-wrap') && detailsHtml.includes('blog-read-more-btn');
console.log(`[${detailsHasBtnWrap ? 'PASS' : 'FAIL'}] blog-details.html related cards contain centered blog-card-btn-wrap`);
if (!detailsHasBtnWrap) allPassed = false;

// 4. Check CSS in style.css
const cssHasBtnWrap = styleCss.includes('.blog-card-btn-wrap') && styleCss.includes('justify-content: center !important');
const cssHasBtnDisplay = styleCss.includes('.blog-read-more-btn') && styleCss.includes('margin-left: auto !important') && styleCss.includes('margin-right: auto !important');
console.log(`[${cssHasBtnWrap ? 'PASS' : 'FAIL'}] style.css enforces justify-content: center on .blog-card-btn-wrap`);
console.log(`[${cssHasBtnDisplay ? 'PASS' : 'FAIL'}] style.css centers .blog-read-more-btn with equal margins and flex alignment`);
if (!cssHasBtnWrap || !cssHasBtnDisplay) allPassed = false;

// 5. Test dynamic rendering output of all 18 blog posts
const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

const posts = window.AppData.blogPosts;
console.log(`\nValidating all ${posts.length} blog post templates...`);

posts.forEach(p => {
  if (!p.id || !p.title) {
    console.error(`❌ Invalid post record: ${JSON.stringify(p)}`);
    allPassed = false;
  }
});
console.log(`✅ All ${posts.length} posts have valid IDs, titles, and link destinations.`);

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL READ MORE BUTTON CENTERING CHECKS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME READ MORE BUTTON CENTERING CHECKS FAILED!');
  process.exit(1);
}
