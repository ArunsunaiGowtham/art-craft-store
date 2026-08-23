const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("VERIFYING INSTRUCTORS ACROSS ALL WORKSHOPS (NO ACCIDENTAL REPETITION)");
console.log("=================================================================\n");

let allPassed = true;

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const workshops = global.window.AppData.workshops;
const instructors = global.window.AppData.instructors;

console.log(`Total workshops: ${workshops.length}`);
console.log(`Registered instructors: ${Object.keys(instructors).length}`);

// Map to check instructor usage across workshops
const instructorCounts = {};
const seenAvatars = new Map();

workshops.forEach(w => {
  console.log(`\n[Workshop ID ${w.id}] "${w.title}"`);
  console.log(`  Category: ${w.category} | Skill Level: ${w.skillLevel}`);
  console.log(`  Instructor: "${w.instructor}" (ID: ${w.instructorId})`);
  console.log(`  Avatar: ${w.instructorAvatar}`);

  if (!w.instructor || !w.instructorId || !w.instructorAvatar) {
    console.error(`  [FAIL] Missing instructor metadata on workshop ${w.id}`);
    allPassed = false;
  }

  // Check registry
  const regInstructor = instructors[w.instructorId];
  if (!regInstructor) {
    console.error(`  [FAIL] Instructor "${w.instructorId}" not found in AppData.instructors registry`);
    allPassed = false;
  } else {
    if (regInstructor.name !== w.instructor) {
      console.error(`  [FAIL] Name mismatch: Workshop says "${w.instructor}", registry says "${regInstructor.name}"`);
      allPassed = false;
    }
    if (regInstructor.avatar !== w.instructorAvatar) {
      console.error(`  [FAIL] Avatar mismatch: Workshop says "${w.instructorAvatar}", registry says "${regInstructor.avatar}"`);
      allPassed = false;
    }
  }

  // Track counts
  instructorCounts[w.instructor] = (instructorCounts[w.instructor] || 0) + 1;

  // Track avatar consistency (same name must have same avatar, different name must have different avatar)
  if (seenAvatars.has(w.instructor)) {
    if (seenAvatars.get(w.instructor) !== w.instructorAvatar) {
      console.error(`  [FAIL] Inconsistent avatar for instructor "${w.instructor}"`);
      allPassed = false;
    }
  } else {
    seenAvatars.set(w.instructor, w.instructorAvatar);
  }
});

console.log("\n--- INSTRUCTOR DISTRIBUTION ---");
Object.entries(instructorCounts).forEach(([name, count]) => {
  console.log(`  ${name}: ${count} workshop(s)`);
  if (count > 1) {
    console.warn(`  [WARNING] Instructor "${name}" teaches ${count} workshops`);
  }
});

// Verify 0 duplicate instructors across all 9 workshops
const uniqueInstructorsCount = Object.keys(instructorCounts).length;
console.log(`\nUnique instructors count: ${uniqueInstructorsCount} / ${workshops.length}`);
if (uniqueInstructorsCount !== workshops.length) {
  console.error(`[FAIL] Found duplicate instructors across workshops! Expected ${workshops.length} unique instructors.`);
  allPassed = false;
} else {
  console.log(`[PASS] Exactly 1 unique, specialized instructor per workshop with zero accidental repetition!`);
}

// 2. Load main.js and test renderWorkshops in simulated environment
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');

// Mock DOM elements and storage
const mockGrid = { innerHTML: '', dataset: {} };
global.localStorage = {
  getItem: function() { return null; },
  setItem: function() {}
};
global.location = { pathname: '/workshops.html', search: '' };
global.window.location = global.location;
global.window.localStorage = global.localStorage;
global.window.matchMedia = function() { return { matches: false, addEventListener: function(){} }; };
global.matchMedia = global.window.matchMedia;
global.window.addEventListener = function() {};
global.document = {
  getElementById: function(id) {
    if (id === 'workshops-grid') return mockGrid;
    return { textContent: '', innerHTML: '', setAttribute: function(){}, style: {}, querySelectorAll: function(){ return []; }, classList: { add: function(){}, remove: function(){} } };
  },
  querySelectorAll: function() { return []; },
  querySelector: function() { return null; },
  addEventListener: function() {},
  documentElement: { setAttribute: function(){}, getAttribute: function(){ return "light"; } },
  body: { classList: { add: function(){}, remove: function(){} } }
};

// Evaluate main.js
eval(mainJs);

// Run initWorkshopsPage if present
if (typeof initWorkshopsPage === 'function') {
  initWorkshopsPage();
}

console.log("\n--- TESTING RENDERED HTML FOR INSTRUCTOR DATA INTEGRITY ---");
workshops.forEach(w => {
  const regInstructor = instructors[w.instructorId];
  if (!mockGrid.innerHTML.includes(w.title)) {
    console.error(`[FAIL] Rendered grid missing workshop "${w.title}"`);
    allPassed = false;
  }
  if (!mockGrid.innerHTML.includes(regInstructor.name)) {
    console.error(`[FAIL] Rendered grid missing instructor name "${regInstructor.name}"`);
    allPassed = false;
  }
  if (!mockGrid.innerHTML.includes(regInstructor.avatar)) {
    console.error(`[FAIL] Rendered grid missing instructor avatar "${regInstructor.avatar}"`);
    allPassed = false;
  }
  console.log(`[PASS] Workshop "${w.title}" correctly rendered with "${regInstructor.name}" and valid avatar`);
});

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL WORKSHOP INSTRUCTOR DATA CHECKS PASSED!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}
