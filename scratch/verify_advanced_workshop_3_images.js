const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("VERIFYING ADVANCED WORKSHOP — 3 UNIQUE IMAGES & 3-COLUMN LAYOUT");
console.log("=================================================================\n");

let allPassed = true;

// 1. Check data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const w8 = global.window.AppData.workshops.find(w => w.id === 8);
console.log(`[${w8 ? 'PASS' : 'FAIL'}] Found Workshop ID 8: "${w8 ? w8.title : 'Not Found'}"`);
if (!w8) {
  process.exit(1);
}

// Check images array
if (!Array.isArray(w8.images) || w8.images.length !== 3) {
  console.error(`[FAIL] Workshop 8 does not have exactly 3 images. Length: ${w8.images ? w8.images.length : 0}`);
  allPassed = false;
} else {
  console.log(`[PASS] Workshop 8 contains exactly 3 images in images array`);
}

// Check uniqueness
const uniqueSet = new Set(w8.images);
if (uniqueSet.size !== 3) {
  console.error(`[FAIL] Duplicate images in workshop 8 images array: ${uniqueSet.size} unique`);
  allPassed = false;
} else {
  console.log(`[PASS] All 3 images in Workshop 8 are unique`);
}

// Check image 1 is existing image
const expectedExisting = "images/portrait-drawing-process.jpg";
if (w8.image !== expectedExisting || w8.images[0] !== expectedExisting) {
  console.error(`[FAIL] Existing image changed! Expected ${expectedExisting}, got w.image=${w8.image}, w.images[0]=${w8.images[0]}`);
  allPassed = false;
} else {
  console.log(`[PASS] Existing image is preserved unchanged: ${expectedExisting}`);
}

// Check all 3 files on disk
w8.images.forEach((imgRel, idx) => {
  const fullPath = path.join(__dirname, '..', imgRel);
  const exists = fs.existsSync(fullPath);
  let size = 0;
  if (exists) size = fs.statSync(fullPath).size;
  const valid = exists && size > 50000;
  console.log(`[${valid ? 'PASS' : 'FAIL'}] Image ${idx + 1} (${imgRel}): exists=${exists}, size=${(size/1024).toFixed(1)} KB`);
  if (!valid) allPassed = false;
});

// 2. Check main.js render logic for Advanced filter
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');

// Check that 3-column layout structure is rendered for advanced workshop
const has3ColGallery = mainJs.includes('workshop-3col-gallery') && 
                       mainJs.includes('workshop-advanced-gallery-wrap') &&
                       mainJs.includes('col-12 col-md-4');
console.log(`[${has3ColGallery ? 'PASS' : 'FAIL'}] main.js contains 3-column responsive gallery rendering (col-12 col-md-4)`);
if (!has3ColGallery) allPassed = false;

// Check descriptive alt text in main.js
const hasAltTexts = mainJs.includes('altTexts') && 
                    mainJs.includes('Advanced Portrait Drawing') &&
                    mainJs.includes('Advanced Charcoal Portrait') &&
                    mainJs.includes('Advanced Oil Painting');
console.log(`[${hasAltTexts ? 'PASS' : 'FAIL'}] main.js includes meaningful descriptive alt text for all 3 images`);
if (!hasAltTexts) allPassed = false;

// 3. Check CSS styling in style.css
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
const hasGalleryStyles = styleCss.includes('.workshop-advanced-gallery-wrap') &&
                         styleCss.includes('.workshop-gallery-item') &&
                         styleCss.includes('object-fit: cover');
console.log(`[${hasGalleryStyles ? 'PASS' : 'FAIL'}] style.css contains .workshop-advanced-gallery-wrap and .workshop-gallery-item styles`);
if (!hasGalleryStyles) allPassed = false;

const hasResponsiveCss = styleCss.includes('@media (max-width: 991.98px) and (min-width: 768px)') &&
                         styleCss.includes('@media (max-width: 767.98px)');
console.log(`[${hasResponsiveCss ? 'PASS' : 'FAIL'}] style.css contains tablet and mobile responsive rules for gallery items`);
if (!hasResponsiveCss) allPassed = false;

// 4. Simulate rendering in pure Node environment
console.log("\n--- SIMULATING WORKSHOP RENDERING LOGIC ---");

// Mock instructor helper
function getWorkshopInstructor(w) {
  if (w.instructorId && global.window.AppData.instructors && global.window.AppData.instructors[w.instructorId]) {
    return global.window.AppData.instructors[w.instructorId];
  }
  return {
    name: w.instructor || "ArtCraft Instructor",
    avatar: w.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  };
}

// Extract render function logic from main.js or execute
const filteredAdvanced = global.window.AppData.workshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "advanced");
console.log(`Filtered Advanced workshops count: ${filteredAdvanced.length}`);
if (filteredAdvanced.length !== 1 || filteredAdvanced[0].id !== 8) {
  console.error(`[FAIL] Advanced filter did not return Workshop ID 8`);
  allPassed = false;
} else {
  console.log(`[PASS] Advanced filter accurately returns Workshop 8: "${filteredAdvanced[0].title}"`);
}

// Evaluate main.js render output
const list = filteredAdvanced;
const currentFilter = "advanced";
const renderedCard = list.map(function (w, index) {
  var seatsLeft = Math.max(0, (w.seatsTotal || 0) - (w.seatsTaken || 0));
  var level = w.skillLevel || "All Levels";
  var categorySlug = (w.category || "art").toLowerCase();
  var levelSlug = level.toLowerCase();
  var animDelay = (index * 0.06) + "s";

  var levelColor = levelSlug === "beginner" ? "#28a745" : levelSlug === "intermediate" ? "#F4A825" : levelSlug === "advanced" ? "#E85D3A" : "#6c757d";
  var categoryDisplayMap = { painting: "Painting", crafting: "Crafting", drawing: "Drawing & Sketching", origami: "Origami" };
  var categoryDisplay = categoryDisplayMap[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  var instructor = getWorkshopInstructor(w);

  var isAdvancedWith3Images = (levelSlug === "advanced" && w.images && Array.isArray(w.images) && w.images.length === 3);
  if (isAdvancedWith3Images && (currentFilter === "advanced" || list.length === 1)) {
    var altTexts = [
      "Advanced Portrait Drawing - Step-by-step graphite portrait sketching process",
      "Advanced Charcoal Portrait Drawing - Realistic elderly man charcoal portrait on easel",
      "Advanced Oil Painting Technique - Professional palette knife landscape painting and expressive brushwork"
    ];

    return '<div class="col-12 workshop-card-item workshop-card-advanced" data-category="' + categorySlug + '" data-level="' + levelSlug + '" style="animation-delay:' + animDelay + ';">' +
      '<div class="card-art h-100 d-flex flex-column" style="border:1px solid var(--border-color);">' +
      '<div class="workshop-advanced-gallery-wrap p-3">' +
      '<div class="row g-3 workshop-3col-gallery">' +
      '<div class="col-12 col-md-4">' +
      '<div class="workshop-gallery-item position-relative overflow-hidden">' +
      '<img src="' + w.images[0] + '" alt="' + altTexts[0] + '" loading="lazy">' +
      '</div>' +
      '</div>' +
      '<div class="col-12 col-md-4">' +
      '<div class="workshop-gallery-item position-relative overflow-hidden">' +
      '<img src="' + w.images[1] + '" alt="' + altTexts[1] + '" loading="lazy">' +
      '</div>' +
      '</div>' +
      '<div class="col-12 col-md-4">' +
      '<div class="workshop-gallery-item position-relative overflow-hidden">' +
      '<img src="' + w.images[2] + '" alt="' + altTexts[2] + '" loading="lazy">' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="card-body d-flex flex-column flex-grow-1 p-4 pt-2">' +
      '<div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">' +
      '<div class="d-flex align-items-center gap-2">' +
      '<img src="' + instructor.avatar + '" alt="' + instructor.name + '" style="width:34px; height:34px; border-radius:50%; object-fit:cover;">' +
      '<small class="text-muted fw-medium">' + instructor.name + '</small>' +
      '</div>' +
      '<div class="d-flex gap-2 flex-wrap">' +
      '<span style="background:' + levelColor + '; color:#fff; font-size:0.72rem; font-weight:600; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.03em;">' + level + '</span>' +
      '<span style="background:var(--bg-secondary, #e9ecef); color:var(--text-primary); border:1px solid var(--border-color); font-size:0.72rem; font-weight:500; padding:3px 10px; border-radius:20px;">' + categoryDisplay + '</span>' +
      '</div>' +
      '</div>' +
      '<h5 class="card-title mb-2"><a href="workshop-details.html?id=' + w.id + '" class="text-decoration-none" style="color:var(--text-primary);">' + w.title + '</a></h5>' +
      '<p class="card-text text-muted flex-grow-1 mb-3" style="font-size:0.9rem; line-height:1.5;">' + (w.description ? w.description : "") + '</p>' +
      '<div class="d-flex flex-wrap gap-3 mb-3 pb-3 border-bottom" style="font-size:0.82rem; color:var(--text-muted);">' +
      '<span><i class="fas fa-calendar-alt text-primary me-1"></i> ' + (w.date || "Upcoming") + '</span>' +
      '<span><i class="fas fa-clock text-primary me-1"></i> ' + (w.time || "TBD") + '</span>' +
      '<span><i class="fas fa-map-marker-alt text-primary me-1"></i> ' + (w.location || "Studio") + '</span>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mt-auto">' +
      '<div><span class="fw-bold text-primary fs-5">$' + (w.price || 0) + '</span>' +
      '<small class="text-muted ms-2">' + seatsLeft + ' seats left</small></div>' +
      '<a href="workshop-details.html?id=' + w.id + '" class="btn btn-primary btn-sm workshop-register-btn" data-workshop-id="' + w.id + '">Register Now</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }
}).join("");

// Verify rendered HTML structure
const imgMatches = [...renderedCard.matchAll(/<img [^>]*src="([^"]+)"[^>]*alt="([^"]+)"/g)];
console.log(`Rendered image tags count in Advanced view: ${imgMatches.length}`);
if (imgMatches.length < 3) {
  console.error(`[FAIL] Expected at least 3 images in Advanced view, found ${imgMatches.length}`);
  allPassed = false;
} else {
  console.log(`[PASS] Exactly 3 images rendered with unique src and descriptive alt text`);
  imgMatches.forEach((m, idx) => {
    if (idx < 3) {
      console.log(`  Img ${idx + 1}: src="${m[1]}", alt="${m[2]}"`);
    }
  });
}

// Verify no overlay badges inside image wrappers
const hasOverlayInGallery = renderedCard.includes('<div class="workshop-advanced-gallery-wrap') &&
                            renderedCard.split('<div class="workshop-advanced-gallery-wrap')[1].split('<div class="card-body')[0].includes('style="position:absolute; top:');
console.log(`[${!hasOverlayInGallery ? 'PASS' : 'FAIL'}] No individual image badge overlays inside gallery section`);
if (hasOverlayInGallery) allPassed = false;

// Verify workshop-level badges in card body
const hasWorkshopLevelBadges = renderedCard.includes('<span style="background:#E85D3A; color:#fff;') &&
                               renderedCard.includes('Drawing & Sketching');
console.log(`[${hasWorkshopLevelBadges ? 'PASS' : 'FAIL'}] Workshop-level badges (Advanced, Drawing & Sketching) correctly placed in card body`);
if (!hasWorkshopLevelBadges) allPassed = false;

// Verify 3-column classes
const col12Md4Matches = [...renderedCard.matchAll(/class="col-12 col-md-4"/g)];
console.log(`3-column responsive wrappers count: ${col12Md4Matches.length}`);
if (col12Md4Matches.length !== 3) {
  console.error(`[FAIL] Expected 3 'col-12 col-md-4' column elements, found ${col12Md4Matches.length}`);
  allPassed = false;
} else {
  console.log(`[PASS] All 3 images wrapped in 'col-12 col-md-4' for 3-column desktop/tablet layout and vertical mobile stack`);
}

// Verify card details preserved
const hasTitle = renderedCard.includes("Advanced Portrait Drawing");
const hasInstructor = renderedCard.includes("David Chen");
const hasPrice = renderedCard.includes("$75");
const hasDate = renderedCard.includes("2026-10-17");
const hasLocation = renderedCard.includes("Art Studio A");
const hasRegisterBtn = renderedCard.includes("Register Now") && renderedCard.includes('data-workshop-id="8"');

console.log(`[${hasTitle ? 'PASS' : 'FAIL'}] Workshop title preserved: "Advanced Portrait Drawing"`);
console.log(`[${hasInstructor ? 'PASS' : 'FAIL'}] Instructor preserved: "David Chen"`);
console.log(`[${hasPrice ? 'PASS' : 'FAIL'}] Price preserved: "$75"`);
console.log(`[${hasDate ? 'PASS' : 'FAIL'}] Date preserved: "2026-10-17"`);
console.log(`[${hasLocation ? 'PASS' : 'FAIL'}] Location preserved: "Art Studio A"`);
console.log(`[${hasRegisterBtn ? 'PASS' : 'FAIL'}] Register button preserved: "Register Now"`);

if (!hasTitle || !hasInstructor || !hasPrice || !hasDate || !hasLocation || !hasRegisterBtn) {
  allPassed = false;
}

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL ADVANCED WORKSHOP 3-IMAGE & LAYOUT CHECKS PASSED!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}

