const fs = require('fs');
const path = require('path');

// 1. Load data.js
const dataContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataContent);

const allWorkshops = window.AppData.workshops;
console.log(`Loaded ${allWorkshops.length} workshops from data.js`);

// 2. Load main.js logic simulation
function isUpcomingWorkshop(w) {
  if (!w || !w.date) return true;
  var now = new Date();
  var wDate = new Date(w.date);
  if (isNaN(wDate.getTime())) return true;

  if (w.time) {
    var match = w.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      var hours = parseInt(match[1], 10);
      var minutes = parseInt(match[2], 10);
      var ampm = match[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      wDate.setHours(hours, minutes, 0, 0);
      return wDate.getTime() >= now.getTime();
    }
  }
  wDate.setHours(23, 59, 59, 999);
  return wDate.getTime() >= now.getTime();
}

function simulateFilter(cat) {
  var rawCat = (cat || "all").toLowerCase().trim();
  var filtered = [];
  var titleText = "All Workshops";
  var countText = "";

  if (rawCat === "all" || rawCat === "") {
    filtered = allWorkshops.slice();
    titleText = "All Workshops";
    countText = "Showing all " + filtered.length + " available workshops";
  } else if (rawCat === "upcoming") {
    filtered = allWorkshops.filter(function (w) {
      return isUpcomingWorkshop(w);
    });
    titleText = "Upcoming Workshops";
    countText = "Showing " + filtered.length + " upcoming workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "beginner") {
    filtered = allWorkshops.filter(function (w) {
      return (w.skillLevel || "").toLowerCase().trim() === "beginner";
    });
    titleText = "Beginner Workshops";
    countText = "Showing " + filtered.length + " beginner workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "intermediate") {
    filtered = allWorkshops.filter(function (w) {
      return (w.skillLevel || "").toLowerCase().trim() === "intermediate";
    });
    titleText = "Intermediate Workshops";
    countText = "Showing " + filtered.length + " intermediate workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "advanced") {
    filtered = allWorkshops.filter(function (w) {
      return (w.skillLevel || "").toLowerCase().trim() === "advanced";
    });
    titleText = "Advanced Workshops";
    countText = "Showing " + filtered.length + " advanced workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "painting") {
    filtered = allWorkshops.filter(function (w) {
      return (w.category || "").toLowerCase().trim() === "painting";
    });
    titleText = "Painting Workshops";
    countText = "Showing " + filtered.length + " painting workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "crafting") {
    filtered = allWorkshops.filter(function (w) {
      return (w.category || "").toLowerCase().trim() === "crafting";
    });
    titleText = "Crafting Workshops";
    countText = "Showing " + filtered.length + " crafting workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "drawing" || rawCat === "drawing & sketching" || rawCat === "sketching") {
    filtered = allWorkshops.filter(function (w) {
      var c = (w.category || "").toLowerCase().trim();
      return c === "drawing" || c === "sketching" || c === "drawing & sketching";
    });
    titleText = "Drawing & Sketching Workshops";
    countText = "Showing " + filtered.length + " drawing & sketching workshop" + (filtered.length === 1 ? "" : "s");
  } else if (rawCat === "origami") {
    filtered = allWorkshops.filter(function (w) {
      return (w.category || "").toLowerCase().trim() === "origami";
    });
    titleText = "Origami Workshops";
    countText = "Showing " + filtered.length + " origami workshop" + (filtered.length === 1 ? "" : "s");
  } else {
    filtered = allWorkshops.filter(function (w) {
      var c = (w.category || "").toLowerCase().trim();
      var l = (w.skillLevel || "").toLowerCase().trim();
      return c === rawCat || l === rawCat;
    });
    var displayLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
    titleText = displayLabel + " Workshops";
    countText = "Showing " + filtered.length + " workshop" + (filtered.length === 1 ? "" : "s");
  }

  return { filtered, titleText, countText };
}

// Test cases
const tests = [
  { filter: "all", expectedTitle: "All Workshops", minCount: 9 },
  { filter: "upcoming", expectedTitle: "Upcoming Workshops", minCount: 1 },
  { filter: "beginner", expectedTitle: "Beginner Workshops", expectedIds: [1, 2, 3, 7, 9] },
  { filter: "intermediate", expectedTitle: "Intermediate Workshops", expectedIds: [4, 5, 6] },
  { filter: "advanced", expectedTitle: "Advanced Workshops", expectedIds: [8] },
  { filter: "painting", expectedTitle: "Painting Workshops", expectedIds: [1, 5, 9] },
  { filter: "crafting", expectedTitle: "Crafting Workshops", expectedIds: [3, 7] },
  { filter: "drawing", expectedTitle: "Drawing & Sketching Workshops", expectedIds: [2, 6, 8] },
  { filter: "origami", expectedTitle: "Origami Workshops", expectedIds: [4] }
];

let allPassed = true;

tests.forEach(t => {
  const result = simulateFilter(t.filter);
  console.log(`\nTesting Filter: [${t.filter}]`);
  console.log(` - Title: "${result.titleText}" (Expected: "${t.expectedTitle}")`);
  console.log(` - Subtitle: "${result.countText}"`);
  console.log(` - Count: ${result.filtered.length}`);
  console.log(` - IDs: [${result.filtered.map(w => w.id).join(', ')}]`);

  if (result.titleText !== t.expectedTitle) {
    console.error(`❌ Title mismatch for filter ${t.filter}`);
    allPassed = false;
  }
  if (t.expectedIds) {
    const actualIds = result.filtered.map(w => w.id).sort((a,b) => a-b);
    const expIds = t.expectedIds.sort((a,b) => a-b);
    if (JSON.stringify(actualIds) !== JSON.stringify(expIds)) {
      console.error(`❌ IDs mismatch for filter ${t.filter}. Expected ${expIds}, got ${actualIds}`);
      allPassed = false;
    }
  }
});

// Test DOM integration in main.js
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
if (!mainJs.includes('isUpcomingWorkshop')) {
  console.error('❌ main.js is missing isUpcomingWorkshop');
  allPassed = false;
}
if (!mainJs.includes('window.initWorkshopsPage = initWorkshopsPage')) {
  console.error('❌ main.js is missing window.initWorkshopsPage export');
  allPassed = false;
}

if (allPassed) {
  console.log('\n======================================');
  console.log('✅ ALL WORKSHOP FILTER TESTS PASSED!');
  console.log('======================================');
} else {
  console.error('\n❌ SOME WORKSHOP FILTER TESTS FAILED!');
  process.exit(1);
}
