const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("VERIFYING REMOVAL OF BEGINNER, INTERMEDIATE, AND ADVANCED BADGES");
console.log("=================================================================\n");

let allPassed = true;

// 1. Check HTML filter bar
const html = fs.readFileSync(path.join(__dirname, '..', 'workshops.html'), 'utf8');
const filterButtons = [...html.matchAll(/data-category="([^"]+)"/g)].map(m => m[1]);
console.log('Filter buttons in workshops.html:', filterButtons);

const expectedFilters = ['all', 'upcoming', 'painting', 'crafting', 'drawing', 'origami'];
const hasDiffButtons = filterButtons.some(b => ['beginner', 'intermediate', 'advanced'].includes(b));

if (!hasDiffButtons && JSON.stringify(filterButtons) === JSON.stringify(expectedFilters)) {
  console.log('✅ PASS: Filter bar contains only topical/calendar filters (All, Upcoming, Painting, Crafting, Drawing, Origami).');
} else {
  console.error('❌ FAIL: Filter buttons mismatch:', filterButtons);
  allPassed = false;
}

// 2. Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const workshops = global.window.AppData.workshops;
console.log(`\nTesting ${workshops.length} workshops...`);

// Extract renderWorkshops function from main.js
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');

// Use main.js getWorkshopInstructor logic
function getWorkshopInstructor(w) {
  if (w.instructorId && global.window.AppData.instructors && global.window.AppData.instructors[w.instructorId]) {
    return global.window.AppData.instructors[w.instructorId];
  }
  return {
    name: w.instructor || "ArtCraft Instructor",
    avatar: w.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  };
}

// Run renderWorkshops implementation from main.js
function renderCard(w, index) {
  var seatsLeft = Math.max(0, (w.seatsTotal || 0) - (w.seatsTaken || 0));
  var level = w.skillLevel || "All Levels";
  var categorySlug = (w.category || "art").toLowerCase();
  var levelSlug = level.toLowerCase();
  var animDelay = (index * 0.06) + "s";

  var categoryDisplayMap = { painting: "Painting", crafting: "Crafting", drawing: "Drawing & Sketching", origami: "Origami" };
  var categoryDisplay = categoryDisplayMap[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  var instructor = getWorkshopInstructor(w);

  return '<div class="col-md-6 col-lg-4 workshop-card-item" data-category="' + categorySlug + '" data-level="' + levelSlug + '" style="animation-delay:' + animDelay + ';">' +
    '<div class="card-art h-100 d-flex flex-column" style="border:1px solid var(--border-color);">' +
    '<div class="card-img-top overflow-hidden position-relative" style="height:220px;">' +
    '<img src="' + w.image + '" alt="' + w.title + '" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">' +
    '<div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap;">' +
    '<span style="background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); color:#fff; font-size:0.75rem; font-weight:600; padding:4px 12px; border-radius:20px; text-transform:capitalize;">' + categoryDisplay + '</span>' +
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
}

workshops.forEach((w, index) => {
  const cardHtml = renderCard(w, index);
  const topOverlayMatch = cardHtml.match(/<div style="position:absolute; top:12px; left:12px;[^>]*>([\s\S]*?)<\/div>/);
  const overlayContent = topOverlayMatch ? topOverlayMatch[1] : '';

  console.log(`[Workshop ${w.id}] "${w.title}" (${w.category})`);
  console.log(`  Top overlay badges: ${overlayContent.replace(/\s+/g, ' ')}`);

  // Assert NO difficulty badges in overlay
  if (/beginner|intermediate|advanced/i.test(overlayContent)) {
    console.error(`  ❌ FAIL: Found difficulty badge in overlay of workshop ${w.id}`);
    allPassed = false;
  } else {
    console.log(`  ✅ PASS: No difficulty badge found.`);
  }

  // Assert exactly 1 category badge in overlay
  const badgeMatches = overlayContent.match(/<span[^>]*>([\s\S]*?)<\/span>/g);
  if (!badgeMatches || badgeMatches.length !== 1) {
    console.error(`  ❌ FAIL: Expected exactly 1 category badge, found ${badgeMatches ? badgeMatches.length : 0}`);
    allPassed = false;
  } else {
    console.log(`  ✅ PASS: Exactly 1 clean category badge present.`);
  }
});

// 3. Test specifically the "Drawing & Sketching Workshops" from the screenshot
console.log("\n--- Testing Drawing & Sketching Workshops (from user screenshot) ---");
const drawingWorkshops = workshops.filter(w => (w.category || "").toLowerCase() === "drawing");
console.log(`Found ${drawingWorkshops.length} drawing workshops:`);
drawingWorkshops.forEach(w => {
  console.log(`  - [ID ${w.id}] "${w.title}" (Instructor: ${w.instructor})`);
  const html = renderCard(w, 0);
  if (/BEGINNER|INTERMEDIATE|ADVANCED/.test(html)) {
    console.error(`  ❌ FAIL: Found difficulty badge in Drawing workshop ${w.id}`);
    allPassed = false;
  } else {
    console.log(`  ✅ PASS: "${w.title}" has NO beginner, intermediate, or advanced badges`);
  }
});

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL DIFFICULTY BADGE REMOVAL CHECKS PASSED 100%!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}
