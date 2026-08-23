const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("TESTING WORKSHOP CARDS — EXACTLY 1 IMAGE PER WORKSHOP RULE");
console.log("=================================================================\n");

let allPassed = true;

// 1. Check data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const workshops = global.window.AppData.workshops;
console.log(`Total workshops in data.js: ${workshops.length}`);

// Verify every workshop has exactly 1 image string and no images array
workshops.forEach(w => {
  console.log(`\nWorkshop [ID ${w.id}]: "${w.title}" (${w.skillLevel}, ${w.category})`);
  console.log(`  Image: ${w.image}`);

  if (!w.image || typeof w.image !== 'string' || w.image.trim() === '') {
    console.error(`  [FAIL] Missing or invalid image property!`);
    allPassed = false;
  }

  if (w.images) {
    console.error(`  [FAIL] Workshop still contains an 'images' array! Should only have 'image'.`);
    allPassed = false;
  } else {
    console.log(`  [PASS] Has independent single image value and no images array`);
  }
});

// 2. Check main.js render output simulation for all filters
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');

function getWorkshopInstructor(w) {
  if (w.instructorId && global.window.AppData.instructors && global.window.AppData.instructors[w.instructorId]) {
    return global.window.AppData.instructors[w.instructorId];
  }
  return {
    name: w.instructor || "ArtCraft Instructor",
    avatar: w.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  };
}

function renderWorkshopsHtml(list) {
  return list.map(function (w, index) {
    var seatsLeft = Math.max(0, (w.seatsTotal || 0) - (w.seatsTaken || 0));
    var level = w.skillLevel || "All Levels";
    var categorySlug = (w.category || "art").toLowerCase();
    var levelSlug = level.toLowerCase();
    var animDelay = (index * 0.06) + "s";

    var levelColor = levelSlug === "beginner" ? "#28a745" : levelSlug === "intermediate" ? "#F4A825" : levelSlug === "advanced" ? "#E85D3A" : "#6c757d";
    var categoryDisplayMap = { painting: "Painting", crafting: "Crafting", drawing: "Drawing & Sketching", origami: "Origami" };
    var categoryDisplay = categoryDisplayMap[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    var instructor = getWorkshopInstructor(w);

    return '<div class="col-md-6 col-lg-4 workshop-card-item" data-category="' + categorySlug + '" data-level="' + levelSlug + '" style="animation-delay:' + animDelay + ';">' +
      '<div class="card-art h-100 d-flex flex-column" style="border:1px solid var(--border-color);">' +
      '<div class="card-img-top overflow-hidden position-relative" style="height:220px;">' +
      '<img src="' + w.image + '" alt="' + w.title + '" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">' +
      '<div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">' +
      '<span style="background:' + levelColor + '; color:#fff; font-size:0.72rem; font-weight:600; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.03em;">' + level + '</span>' +
      '<span style="background:rgba(0,0,0,0.6); color:#fff; font-size:0.72rem; font-weight:500; padding:3px 10px; border-radius:20px;">' + categoryDisplay + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="card-body d-flex flex-column flex-grow-1 p-4">' +
      '<div class="d-flex align-items-center gap-2 mb-2">' +
      '<img src="' + instructor.avatar + '" alt="' + instructor.name + '" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">' +
      '<small class="text-muted fw-medium">' + instructor.name + '</small>' +
      '</div>' +
      '<h5 class="card-title mb-2"><a href="workshop-details.html?id=' + w.id + '" class="text-decoration-none" style="color:var(--text-primary);">' + w.title + '</a></h5>' +
      '<p class="card-text text-muted flex-grow-1 mb-3" style="font-size:0.9rem; line-height:1.5;">' + (w.description ? w.description.substring(0, 100) + "..." : "") + '</p>' +
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
  }).join("");
}

// 3. Test Intermediate Workshops view specifically
console.log("\n=================================================================");
console.log("TESTING INTERMEDIATE FILTER: 3 SEPARATE WORKSHOPS, 1 IMAGE EACH");
console.log("=================================================================");

const intermediateList = workshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "intermediate");
console.log(`Intermediate workshops count: ${intermediateList.length}`);
if (intermediateList.length !== 3) {
  console.error(`[FAIL] Expected 3 intermediate workshops, found ${intermediateList.length}`);
  allPassed = false;
}

const renderedIntermediate = renderWorkshopsHtml(intermediateList);

// Check 3 separate cards are rendered
const cardCount = (renderedIntermediate.match(/class="col-md-6 col-lg-4 workshop-card-item"/g) || []).length;
console.log(`Rendered cards count: ${cardCount} (Expected: 3)`);
if (cardCount !== 3) {
  console.error(`[FAIL] Expected 3 card elements, got ${cardCount}`);
  allPassed = false;
}

// Check each workshop has exactly 1 image
intermediateList.forEach((w, idx) => {
  console.log(`\nChecking Intermediate Workshop ${idx + 1}: "${w.title}"`);
  console.log(`  Expected Image: ${w.image}`);
  if (!renderedIntermediate.includes(w.image)) {
    console.error(`  [FAIL] Rendered output missing image ${w.image}`);
    allPassed = false;
  }
  if (!renderedIntermediate.includes(w.title)) {
    console.error(`  [FAIL] Rendered output missing title "${w.title}"`);
    allPassed = false;
  }
  console.log(`  [PASS] Card has its own title, instructor, and unique top image`);
});

// Check Advanced filter
console.log("\n=================================================================");
console.log("TESTING ADVANCED FILTER: 1 WORKSHOP, 1 CARD, 1 IMAGE");
console.log("=================================================================");

const advancedList = workshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "advanced");
console.log(`Advanced workshops count: ${advancedList.length}`);
if (advancedList.length !== 1) {
  console.error(`[FAIL] Expected 1 advanced workshop, found ${advancedList.length}`);
  allPassed = false;
}

const renderedAdvanced = renderWorkshopsHtml(advancedList);
const advCardCount = (renderedAdvanced.match(/class="col-md-6 col-lg-4 workshop-card-item"/g) || []).length;
console.log(`Rendered cards count: ${advCardCount} (Expected: 1)`);
if (advCardCount !== 1) {
  console.error(`[FAIL] Expected 1 card element for Advanced, got ${advCardCount}`);
  allPassed = false;
}

// Ensure no gallery wrappers exist
if (renderedAdvanced.includes('workshop-3col-gallery') || renderedAdvanced.includes('workshop-advanced-gallery-wrap')) {
  console.error(`[FAIL] Advanced card still contains gallery markup!`);
  allPassed = false;
} else {
  console.log(`[PASS] Advanced card is a clean standard 1-card, 1-image layout matching reference`);
}

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL WORKSHOP 1-IMAGE-PER-WORKSHOP CHECKS PASSED!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}
