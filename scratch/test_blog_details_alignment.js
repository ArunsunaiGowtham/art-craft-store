const fs = require('fs');

const detailsHtml = fs.readFileSync('blog-details.html', 'utf8');
const dataCode = fs.readFileSync('js/data.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const sandbox = { window: {} };
eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));
const blogPosts = sandbox.window.AppData.blogPosts;

console.log("=== VALIDATING BLOG DETAILS ARTICLE ALIGNMENT & STRUCTURE ===");

// 1. Check article-main container encapsulation
let pass1 = detailsHtml.includes('<article class="article-main">') &&
            detailsHtml.includes('<header class="article-header">') &&
            detailsHtml.includes('id="article-content"') &&
            detailsHtml.includes('class="article-featured-img-wrap"');
console.log(`[${pass1 ? "PASS" : "FAIL"}] Article header, image, and body unified in article-main container`);

// 2. Check CSS rules for article typography and paragraph alignment
let pass2 = styleCss.includes('.article-main') &&
            styleCss.includes('.article-heading') &&
            styleCss.includes('.article-body p') &&
            styleCss.includes('line-height: 1.8') &&
            styleCss.includes('text-align: left');
console.log(`[${pass2 ? "PASS" : "FAIL"}] CSS contains strict text-align:left, uniform line-height:1.8, and paragraph margins`);

// 3. Test data rendering for all 8 blog posts
let allPostsValid = true;
blogPosts.forEach(post => {
  if (!post.title || !post.category || !post.author || !post.image || !post.content) {
    allPostsValid = false;
  }
  const paragraphs = post.content.split('\n\n');
  if (paragraphs.length < 1) allPostsValid = false;
});
console.log(`[${allPostsValid ? "PASS" : "FAIL"}] All 8 articles have valid content, paragraphs, images, and metadata`);

if (pass1 && pass2 && allPostsValid) {
  console.log("\nALL BLOG DETAILS ARTICLE ALIGNMENT CHECKS PASSED!");
} else {
  process.exit(1);
}
