const fs = require('fs');
const path = require('path');

console.log("=== VERIFYING WORKSHOP CATEGORY FILTER BUTTONS & BEHAVIOR ===\n");

const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

const allWorkshops = window.AppData.workshops;
console.log(`Loaded ${allWorkshops.length} workshops from data.js\n`);

function isUpcomingWorkshop(w) {
  if (!w || !w.date) return true;
  var now = new Date();
  now.setHours(0, 0, 0, 0);

  var parts = (w.date || "").split("-");
  if (parts.length === 3) {
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    var wDate = new Date(year, month, day);

    if (w.time) {
      var match = w.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        var hours = parseInt(match[1], 10);
        var minutes = parseInt(match[2], 10);
        var ampm = match[3].toUpperCase();
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        wDate.setHours(hours, minutes, 0, 0);
        return wDate.getTime() >= new Date().getTime();
      }
    }
    wDate.setHours(23, 59, 59, 999);
    return wDate.getTime() >= new Date().getTime();
  }

  var fallbackDate = new Date(w.date);
  fallbackDate.setHours(23, 59, 59, 999);
  return isNaN(fallbackDate.getTime()) ? true : fallbackDate.getTime() >= new Date().getTime();
}

function filterCategory(rawCat) {
  var cat = (rawCat || "all").toLowerCase().trim();
  if (cat === "drawing & sketching" || cat === "sketching") cat = "drawing";

  var filtered = [];
  var titleText = "All Workshops";
  var countText = "";

  if (cat === "all" || cat === "") {
    filtered = allWorkshops.slice();
    titleText = "All Workshops";
    countText = "Showing all " + filtered.length + " available workshops";
  } else if (cat === "upcoming") {
    filtered = allWorkshops.filter(isUpcomingWorkshop);
    titleText = "Upcoming Workshops";
    countText = "Showing " + filtered.length + " upcoming workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "beginner") {
    filtered = allWorkshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "beginner");
    titleText = "Beginner Workshops";
    countText = "Showing " + filtered.length + " beginner workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "intermediate") {
    filtered = allWorkshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "intermediate");
    titleText = "Intermediate Workshops";
    countText = "Showing " + filtered.length + " intermediate workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "advanced") {
    filtered = allWorkshops.filter(w => (w.skillLevel || "").toLowerCase().trim() === "advanced");
    titleText = "Advanced Workshops";
    countText = "Showing " + filtered.length + " advanced workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "painting") {
    filtered = allWorkshops.filter(w => (w.category || "").toLowerCase().trim() === "painting");
    titleText = "Painting Workshops";
    countText = "Showing " + filtered.length + " painting workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "crafting") {
    filtered = allWorkshops.filter(w => (w.category || "").toLowerCase().trim() === "crafting");
    titleText = "Crafting Workshops";
    countText = "Showing " + filtered.length + " crafting workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "drawing") {
    filtered = allWorkshops.filter(w => {
      var c = (w.category || "").toLowerCase().trim();
      return c === "drawing" || c === "sketching" || c === "drawing & sketching";
    });
    titleText = "Drawing & Sketching Workshops";
    countText = "Showing " + filtered.length + " drawing & sketching workshop" + (filtered.length === 1 ? "" : "s");
  } else if (cat === "origami") {
    filtered = allWorkshops.filter(w => (w.category || "").toLowerCase().trim() === "origami");
    titleText = "Origami Workshops";
    countText = "Showing " + filtered.length + " origami workshop" + (filtered.length === 1 ? "" : "s");
  }

  return { filtered, titleText, countText };
}

const tests = [
  { cat: "all", expectedCount: 9, expectedTitle: "All Workshops", expectedIds: [1,2,3,4,5,6,7,8,9] },
  { cat: "upcoming", expectedCount: 9, expectedTitle: "Upcoming Workshops", expectedIds: [1,2,3,4,5,6,7,8,9] },
  { cat: "beginner", expectedCount: 5, expectedTitle: "Beginner Workshops", expectedIds: [1,2,3,7,9] },
  { cat: "intermediate", expectedCount: 3, expectedTitle: "Intermediate Workshops", expectedIds: [4,5,6] },
  { cat: "advanced", expectedCount: 1, expectedTitle: "Advanced Workshops", expectedIds: [8] },
  { cat: "painting", expectedCount: 3, expectedTitle: "Painting Workshops", expectedIds: [1,5,9] },
  { cat: "crafting", expectedCount: 2, expectedTitle: "Crafting Workshops", expectedIds: [3,7] },
  { cat: "drawing", expectedCount: 3, expectedTitle: "Drawing & Sketching Workshops", expectedIds: [2,6,8] },
  { cat: "origami", expectedCount: 1, expectedTitle: "Origami Workshops", expectedIds: [4] }
];

let allPassed = true;

tests.forEach(t => {
  const res = filterCategory(t.cat);
  const ids = res.filtered.map(w => w.id);
  const countMatches = res.filtered.length === t.expectedCount;
  const titleMatches = res.titleText === t.expectedTitle;
  const idsMatch = JSON.stringify(ids.sort()) === JSON.stringify(t.expectedIds.sort());

  console.log(`Testing Category: [${t.cat}]`);
  console.log(`  - Title: "${res.titleText}" (Expected: "${t.expectedTitle}") -> ${titleMatches ? 'OK' : 'FAIL'}`);
  console.log(`  - Subtitle: "${res.countText}"`);
  console.log(`  - Count: ${res.filtered.length} (Expected: ${t.expectedCount}) -> ${countMatches ? 'OK' : 'FAIL'}`);
  console.log(`  - Matching Workshop IDs: [${ids.join(', ')}] -> ${idsMatch ? 'OK' : 'FAIL'}`);

  if (!countMatches || !titleMatches || !idsMatch) {
    console.error(`❌ Category [${t.cat}] failed test!`);
    allPassed = false;
  }
  console.log("");
});

// Check workshops.html contains all 9 buttons
const workshopsHtml = fs.readFileSync(path.join(__dirname, '..', 'workshops.html'), 'utf8');
const buttonCategories = ['all', 'upcoming', 'beginner', 'intermediate', 'advanced', 'painting', 'crafting', 'drawing', 'origami'];

buttonCategories.forEach(cat => {
  const hasBtn = workshopsHtml.includes(`data-category="${cat}"`);
  console.log(`[${hasBtn ? 'PASS' : 'FAIL'}] workshops.html contains filter button for data-category="${cat}"`);
  if (!hasBtn) allPassed = false;
});

// Check css/style.css contains active button styling
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
const hasActiveStyle = styleCss.includes('.workshop-filter-btn.active') && styleCss.includes('background: var(--primary) !important');
console.log(`\n[${hasActiveStyle ? 'PASS' : 'FAIL'}] style.css contains .workshop-filter-btn.active with primary orange background`);
if (!hasActiveStyle) allPassed = false;

if (allPassed) {
  console.log('\n======================================================');
  console.log('✅ ALL WORKSHOP CATEGORY FILTERING TESTS PASSED!');
  console.log('======================================================');
} else {
  console.error('\n❌ SOME WORKSHOP CATEGORY FILTERING TESTS FAILED!');
  process.exit(1);
}
