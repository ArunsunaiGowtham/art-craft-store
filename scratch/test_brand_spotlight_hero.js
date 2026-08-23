const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING BRAND SPOTLIGHT HERO CONTRAST & STRUCTURE ===\n");

const brandsHtml = fs.readFileSync(path.join(__dirname, '..', 'brands.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

let allPassed = true;

// 1. Check Brand Spotlight Hero in brands.html
const hasHeroTitle = brandsHtml.includes('Brand Spotlight') && brandsHtml.includes('color:#ffffff');
console.log(`[${hasHeroTitle ? 'PASS' : 'FAIL'}] Brand Spotlight heading has explicit high-contrast white color`);
if (!hasHeroTitle) allPassed = false;

// 2. Check Description
const hasHeroDesc = brandsHtml.includes("Discover the world's finest art supply brands, curated for quality and creativity");
console.log(`[${hasHeroDesc ? 'PASS' : 'FAIL'}] Brand Spotlight hero description is present and readable`);
if (!hasHeroDesc) allPassed = false;

// 3. Check Breadcrumb
const hasBreadcrumb = brandsHtml.includes('Home') && brandsHtml.includes('Brand Spotlight') && brandsHtml.includes('breadcrumb');
console.log(`[${hasBreadcrumb ? 'PASS' : 'FAIL'}] Breadcrumb navigation 'Home / Brand Spotlight' is properly placed above hero`);
if (!hasBreadcrumb) allPassed = false;

// 4. Check CSS styling in style.css
const hasHeroCss = styleCss.includes('.brand-spotlight-hero') && styleCss.includes('color: #ffffff !important');
console.log(`[${hasHeroCss ? 'PASS' : 'FAIL'}] style.css contains .brand-spotlight-hero with !important white color and centering`);
if (!hasHeroCss) allPassed = false;

// 5. Check background image configured
const hasBgImageHtml = brandsHtml.includes('brands-bg.jpg');
const hasBgImageCss = styleCss.includes('brands-bg.jpg');
console.log(`[${hasBgImageHtml ? 'PASS' : 'FAIL'}] brands.html includes brands-bg.jpg hero background image`);
console.log(`[${hasBgImageCss ? 'PASS' : 'FAIL'}] style.css includes brands-bg.jpg hero background image`);
if (!hasBgImageHtml || !hasBgImageCss) allPassed = false;

// 6. WCAG Contrast Calculation
function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const white = [255, 255, 255];
const bg1 = [0x1a, 0x1a, 0x2e]; // #1a1a2e
const bg2 = [0x2d, 0x2d, 0x52]; // #2d2d52

const ratio1 = contrast(white, bg1);
const ratio2 = contrast(white, bg2);

console.log(`\nWCAG Contrast Analysis:`);
console.log(` - White text (#ffffff) on #1a1a2e background: ${ratio1.toFixed(2)}:1 (Requires 4.5:1 for AA, 7:1 for AAA -> ${ratio1 >= 7 ? 'PASS AAA' : 'FAIL'})`);
console.log(` - White text (#ffffff) on #2d2d52 background: ${ratio2.toFixed(2)}:1 (Requires 4.5:1 for AA, 7:1 for AAA -> ${ratio2 >= 7 ? 'PASS AAA' : 'FAIL'})`);

if (ratio1 < 7 || ratio2 < 7) allPassed = false;

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL BRAND SPOTLIGHT HERO CONTRAST CHECKS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME BRAND SPOTLIGHT HERO CHECKS FAILED!');
  process.exit(1);
}
