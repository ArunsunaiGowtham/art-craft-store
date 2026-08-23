const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("VERIFYING CRAFTING WORKSHOPS — REMOVAL OF BEGINNER BADGE");
console.log("=================================================================\n");

let allPassed = true;

// 1. Load data.js and main.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const workshops = global.window.AppData.workshops;

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

    var isCrafting = categorySlug === "crafting";
    var levelBadgeHtml = isCrafting ? "" : '<span style="background:' + levelColor + '; color:#fff; font-size:0.72rem; font-weight:600; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.03em;">' + level + '</span>';

    return '<div class="col-md-6 col-lg-4 workshop-card-item" data-category="' + categorySlug + '" data-level="' + levelSlug + '" style="animation-delay:' + animDelay + ';">' +
      '<div class="card-art h-100 d-flex flex-column" style="border:1px solid var(--border-color);">' +
      '<div class="card-img-top overflow-hidden position-relative" style="height:220px;">' +
      '<img src="' + w.image + '" alt="' + w.title + '" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">' +
      '<div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">' +
      levelBadgeHtml +
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

// 2. Test Crafting workshops specifically
console.log("--- 1. Testing Crafting Workshops Section ---");
const craftingWorkshops = workshops.filter(w => (w.category || "").toLowerCase().trim() === "crafting");
console.log(`Found ${craftingWorkshops.length} crafting workshops:`);
craftingWorkshops.forEach(w => console.log(`  - [ID ${w.id}] "${w.title}"`));

if (craftingWorkshops.length !== 2) {
  console.error(`[FAIL] Expected 2 crafting workshops, found ${craftingWorkshops.length}`);
  allPassed = false;
}

const renderedCrafting = renderWorkshopsHtml(craftingWorkshops);

// Verify NO "Beginner" or "BEGINNER" badge in crafting cards
if (renderedCrafting.toLowerCase().includes('span style="background:#28a745;') ||
    renderedCrafting.toLowerCase().includes('text-transform:uppercase; letter-spacing:0.03em;">beginner')) {
  console.error(`[FAIL] Crafting cards still contain Beginner badge!`);
  allPassed = false;
} else {
  console.log(`[PASS] Green BEGINNER badge is completely absent from Crafting workshop cards`);
}

// Verify "Crafting" badge is present
const craftingBadgeCount = (renderedCrafting.match(/<span style="background:rgba\(0,0,0,0\.6\); color:#fff; font-size:0\.72rem; font-weight:500; padding:3px 10px; border-radius:20px;">Crafting<\/span>/g) || []).length;
console.log(`Crafting badges count: ${craftingBadgeCount} (Expected: 2)`);
if (craftingBadgeCount !== 2) {
  console.error(`[FAIL] Expected exactly 2 Crafting category badges, got ${craftingBadgeCount}`);
  allPassed = false;
} else {
  console.log(`[PASS] Exactly 2 Crafting category badges present and intact`);
}

// Verify card details are preserved
craftingWorkshops.forEach(w => {
  if (!renderedCrafting.includes(w.title)) {
    console.error(`[FAIL] Missing workshop title: ${w.title}`);
    allPassed = false;
  }
  if (!renderedCrafting.includes(w.image)) {
    console.error(`[FAIL] Missing workshop image: ${w.image}`);
    allPassed = false;
  }
  if (!renderedCrafting.includes(w.instructor)) {
    console.error(`[FAIL] Missing instructor: ${w.instructor}`);
    allPassed = false;
  }
  console.log(`[PASS] Verified content, image, instructor, and price for "${w.title}"`);
});

// 3. Test non-crafting workshops retain their level badges
console.log("\n--- 2. Testing Non-Crafting Workshops Retain Badges ---");
const paintingWorkshops = workshops.filter(w => (w.category || "").toLowerCase().trim() === "painting");
const renderedPainting = renderWorkshopsHtml(paintingWorkshops);

const beginnerPaintingCount = (renderedPainting.match(/Beginner/g) || []).length;
console.log(`Painting cards Beginner badges count: ${beginnerPaintingCount} (Expected: >= 2)`);
if (beginnerPaintingCount < 2) {
  console.error(`[FAIL] Non-crafting workshops lost their beginner badge!`);
  allPassed = false;
} else {
  console.log(`[PASS] Non-crafting beginner workshops still have their BEGINNER badge`);
}

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL CRAFTING BADGE REMOVAL CHECKS PASSED!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}
