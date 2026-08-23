const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING OUR STORY SECTION VERTICAL ALIGNMENT & STRUCTURE ===\n");

const aboutHtml = fs.readFileSync(path.join(__dirname, '..', 'about.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

let allPassed = true;

// 1. Check our-story-section presence in about.html
const hasOurStorySection = aboutHtml.includes('class="our-story-section');
console.log(`[${hasOurStorySection ? 'PASS' : 'FAIL'}] about.html contains <section class="our-story-section">`);
if (!hasOurStorySection) allPassed = false;

// 2. Check two-column layout with align-items-center
const hasAlignItemsCenter = aboutHtml.includes('row align-items-center') && aboutHtml.includes('col-lg-6');
console.log(`[${hasAlignItemsCenter ? 'PASS' : 'FAIL'}] Two-column layout uses row align-items-center for true vertical centering`);
if (!hasAlignItemsCenter) allPassed = false;

// 3. Check image container and image classes
const hasImageStructure = aboutHtml.includes('our-story-img-container') && aboutHtml.includes('our-story-img');
console.log(`[${hasImageStructure ? 'PASS' : 'FAIL'}] Image is wrapped in .our-story-img-container with .our-story-img`);
if (!hasImageStructure) allPassed = false;

// 4. Check content container grouping heading + paragraphs
const hasContentGroup = aboutHtml.includes('our-story-content') && aboutHtml.includes('our-story-title') && aboutHtml.includes('our-story-text');
console.log(`[${hasContentGroup ? 'PASS' : 'FAIL'}] Text content is grouped into .our-story-content with .our-story-title and .our-story-text`);
if (!hasContentGroup) allPassed = false;

// 5. Check CSS rules in style.css
const hasCssFlexVertical = styleCss.includes('.our-story-content') && styleCss.includes('justify-content: center');
console.log(`[${hasCssFlexVertical ? 'PASS' : 'FAIL'}] style.css enforces justify-content: center on .our-story-content`);
if (!hasCssFlexVertical) allPassed = false;

const hasCssImageAspect = styleCss.includes('.our-story-img') && styleCss.includes('aspect-ratio: 4 / 3') && styleCss.includes('object-fit: cover');
console.log(`[${hasCssImageAspect ? 'PASS' : 'FAIL'}] style.css enforces 4/3 aspect-ratio and object-fit: cover for stable layout`);
if (!hasCssImageAspect) allPassed = false;

const hasResponsiveMediaQueries = styleCss.includes('@media (max-width: 991.98px)') && styleCss.includes('.our-story-img-container');
console.log(`[${hasResponsiveMediaQueries ? 'PASS' : 'FAIL'}] style.css contains responsive stacking rules for tablet & mobile`);
if (!hasResponsiveMediaQueries) allPassed = false;

// 6. Check no arbitrary position absolute hacks
const hasNoHacks = !aboutHtml.includes('style="position:absolute;top:') && !aboutHtml.includes('style="margin-top:-');
console.log(`[${hasNoHacks ? 'PASS' : 'FAIL'}] Clean standard flexbox/grid layout without arbitrary negative margin or absolute positioning hacks`);
if (!hasNoHacks) allPassed = false;

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL OUR STORY SECTION ALIGNMENT CHECKS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME OUR STORY SECTION ALIGNMENT CHECKS FAILED!');
  process.exit(1);
}
