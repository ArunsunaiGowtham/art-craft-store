const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING BLOG HERO / HEADER SECTION ALIGNMENT & STRUCTURE ===\n");

const blogHtml = fs.readFileSync(path.join(__dirname, '..', 'blog.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

let allPassed = true;

// 1. Check blog-hero-section presence in blog.html
const hasHeroSection = blogHtml.includes('class="blog-hero-section"');
console.log(`[${hasHeroSection ? 'PASS' : 'FAIL'}] blog.html contains unified <section class="blog-hero-section">`);
if (!hasHeroSection) allPassed = false;

// 2. Check breadcrumb inside blog-hero-section container
const heroSectionMatch = blogHtml.match(/<section class="blog-hero-section">([\s\S]*?)<\/section>/);
if (heroSectionMatch) {
  const heroContent = heroSectionMatch[1];
  const hasBreadcrumbInContainer = heroContent.includes('breadcrumb-art') && heroContent.includes('Home') && heroContent.includes('Blog');
  console.log(`[${hasBreadcrumbInContainer ? 'PASS' : 'FAIL'}] Breadcrumb (Home / Blog) is inside the centered container of the blog hero section`);
  if (!hasBreadcrumbInContainer) allPassed = false;

  const hasTitleGroup = heroContent.includes('Creative') && heroContent.includes('Journal') && heroContent.includes('font-accent') && heroContent.includes('section-subtitle');
  console.log(`[${hasTitleGroup ? 'PASS' : 'FAIL'}] Hero content group contains 'Creative Journal' with accent styling and centered subtitle`);
  if (!hasTitleGroup) allPassed = false;
} else {
  console.error('[FAIL] Could not match blog-hero-section in blog.html');
  allPassed = false;
}

// 3. Check CSS rules in style.css
const hasHeroSectionCss = styleCss.includes('.blog-hero-section') && styleCss.includes('.blog-hero-content');
console.log(`[${hasHeroSectionCss ? 'PASS' : 'FAIL'}] style.css contains .blog-hero-section and .blog-hero-content rules`);
if (!hasHeroSectionCss) allPassed = false;

const hasUnderlineCenter = styleCss.includes('.blog-hero-content .section-title::after') && styleCss.includes('left: 50%') && styleCss.includes('transform: translateX(-50%)');
console.log(`[${hasUnderlineCenter ? 'PASS' : 'FAIL'}] Orange underline is centered exactly beneath the heading`);
if (!hasUnderlineCenter) allPassed = false;

const hasBreadcrumbLeftAlign = styleCss.includes('.blog-hero-section .breadcrumb-art') && styleCss.includes('align-self: flex-start');
console.log(`[${hasBreadcrumbLeftAlign ? 'PASS' : 'FAIL'}] Breadcrumb is aligned to the container left boundary`);
if (!hasBreadcrumbLeftAlign) allPassed = false;

// 4. Check no arbitrary position absolute hacks on hero text
const hasNoHacks = !blogHtml.includes('style="position:absolute;left:') && !blogHtml.includes('style="transform:translate(');
console.log(`[${hasNoHacks ? 'PASS' : 'FAIL'}] Clean standard flexbox/container layout without arbitrary position absolute hacks`);
if (!hasNoHacks) allPassed = false;

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL BLOG HERO ALIGNMENT CHECKS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME BLOG HERO ALIGNMENT CHECKS FAILED!');
  process.exit(1);
}
