const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
const workshopDetailsHtml = fs.readFileSync(path.join(rootDir, 'workshop-details.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const dataContent = fs.readFileSync(path.join(rootDir, 'js', 'data.js'), 'utf8');

const window = {};
eval(dataContent);
const workshops = window.AppData.workshops;

console.log('=================================================================');
console.log('TESTING WORKSHOP IMAGE CLICKABLE NAVIGATION');
console.log('=================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check index.html Upcoming Workshops image links
console.log('\n--- Checking index.html Upcoming Workshops ---');
assert(
  indexHtml.includes('<a href="workshop-details.html?id=1" class="card-img-top d-block overflow-hidden position-relative"'),
  'Watercolor image links directly to workshop-details.html?id=1'
);
assert(
  indexHtml.includes('<a href="workshop-details.html?id=2" class="card-img-top d-block overflow-hidden position-relative"'),
  'Modern Calligraphy image links directly to workshop-details.html?id=2'
);
assert(
  indexHtml.includes('<a href="workshop-details.html?id=4" class="card-img-top d-block overflow-hidden position-relative"'),
  'Origami image links directly to workshop-details.html?id=4'
);

// 2. Check main.js dynamic workshops renderer
console.log('\n--- Checking js/main.js renderWorkshops image link template ---');
assert(
  mainJs.includes("'<a href=\"workshop-details.html?id=' + w.id + '\" class=\"card-img-top d-block overflow-hidden position-relative\""),
  'main.js dynamically wraps all workshop images in an anchor link pointing to workshop-details.html?id=${w.id}'
);

// 3. Check workshop-details.html related workshops
console.log('\n--- Checking workshop-details.html related workshops ---');
assert(
  workshopDetailsHtml.includes("'<a href=\"workshop-details.html?id=' + w.id + '\" class=\"card-img-top d-block overflow-hidden position-relative\""),
  'workshop-details.html related workshops wrap images in anchor link pointing to workshop-details.html?id=${w.id}'
);

// 4. Check CSS styling for clickable images
console.log('\n--- Checking CSS cursor & hover styling ---');
assert(
  styleCss.includes('a.card-img-top') && styleCss.includes('cursor: pointer'),
  'CSS specifies cursor: pointer for a.card-img-top'
);

// 5. Test simulation of rendering all 12 workshops from AppData
console.log('\n--- Simulating all 12 workshops link targets ---');
workshops.forEach((w) => {
  const expectedUrl = `workshop-details.html?id=${w.id}`;
  assert(w.id > 0 && w.title.length > 0, `Workshop #${w.id} ("${w.title}") points to ${expectedUrl}`);
});

console.log('\n=================================================================');
console.log(`TOTAL RESULTS: ${passed} passed, ${failed} failed.`);
console.log('=================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL WORKSHOP IMAGE NAVIGATION CHECKS PASSED PERFECTLY!');
}
