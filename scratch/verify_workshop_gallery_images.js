const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING WORKSHOP DETAILS GALLERY & 3 PORTRAIT IMAGES ===\n");

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

let allPassed = true;

const w8 = window.AppData.workshops.find(w => w.id === 8);
console.log(`[${w8 ? 'PASS' : 'FAIL'}] Found Workshop ID 8: "${w8 ? w8.title : 'Not Found'}"`);
if (!w8) process.exit(1);

// 1. Check images array length is exactly 3
const has3Images = Array.isArray(w8.images) && w8.images.length === 3;
console.log(`[${has3Images ? 'PASS' : 'FAIL'}] Workshop ID 8 has images array with exactly 3 images`);
if (!has3Images) allPassed = false;

// 2. Check all 3 images are distinct
const uniqueImages = new Set(w8.images);
const allDistinct = uniqueImages.size === 3;
console.log(`[${allDistinct ? 'PASS' : 'FAIL'}] All 3 images are distinct without duplication`);
if (!allDistinct) allPassed = false;

// 3. Verify each image file exists on disk and is non-empty
w8.images.forEach((imgRelPath, idx) => {
  const fullPath = path.join(__dirname, '..', imgRelPath);
  const exists = fs.existsSync(fullPath);
  let size = 0;
  if (exists) {
    size = fs.statSync(fullPath).size;
  }
  const valid = exists && size > 10000;
  console.log(`[${valid ? 'PASS' : 'FAIL'}] Image ${idx + 1} (${imgRelPath}) exists and is valid (${(size / 1024).toFixed(1)} KB)`);
  if (!valid) allPassed = false;
});

// 4. Verify workshop-details.html contains gallery structure and JS
const detailsHtml = fs.readFileSync(path.join(__dirname, '..', 'workshop-details.html'), 'utf8');
const hasGalleryContainer = detailsHtml.includes('workshop-gallery-wrapper') && detailsHtml.includes('workshop-thumbnails-row');
console.log(`[${hasGalleryContainer ? 'PASS' : 'FAIL'}] workshop-details.html contains gallery wrapper and thumbnails row`);
if (!hasGalleryContainer) allPassed = false;

const hasGalleryScript = detailsHtml.includes('galleryImages') && detailsHtml.includes('workshop-thumb');
console.log(`[${hasGalleryScript ? 'PASS' : 'FAIL'}] workshop-details.html contains gallery thumbnail generation and click handling`);
if (!hasGalleryScript) allPassed = false;

// 5. Verify style.css contains gallery styles
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
const hasGalleryCss = styleCss.includes('.workshop-gallery-wrapper') && 
                      styleCss.includes('.workshop-thumb.active') && 
                      styleCss.includes('border-color: var(--primary) !important');
console.log(`[${hasGalleryCss ? 'PASS' : 'FAIL'}] style.css contains gallery styling with active thumbnail borders`);
if (!hasGalleryCss) allPassed = false;

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL WORKSHOP GALLERY IMAGE CHECKS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME WORKSHOP GALLERY IMAGE CHECKS FAILED!');
  process.exit(1);
}
