const fs = require('fs');

const dataCode = fs.readFileSync('js/data.js', 'utf8');
const mainCode = fs.readFileSync('js/main.js', 'utf8');

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    documentElement: { setAttribute: () => {} },
    querySelector: () => null,
    querySelectorAll: () => []
  }
};

eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));

const workshops = sandbox.window.AppData.workshops;

console.log("=== VALIDATING NEW WATERCOLOR WORKSHOP ===");

// 1. Total workshops count
console.log(`Total workshops in catalog: ${workshops.length}`);
let pass1 = workshops.length === 9;
console.log(`[${pass1 ? "PASS" : "FAIL"}] Total workshops count is 9 (completing 3x3 grid)`);

// 2. Workshop #9 properties
const w9 = workshops.find(w => w.id === 9);
let pass2 = w9 &&
            w9.title.toLowerCase().includes("watercolor") &&
            w9.category === "painting" &&
            w9.skillLevel === "Beginner" &&
            w9.price === 55 &&
            w9.image &&
            w9.instructor &&
            w9.whatYouWillLearn.length >= 4;
console.log(`[${pass2 ? "PASS" : "FAIL"}] Workshop #9 has complete valid metadata and watercolor learning points`);

// 3. Image uniqueness
const images = workshops.map(w => w.image);
const uniqueImages = new Set(images);
let pass3 = images.length === uniqueImages.size;
console.log(`[${pass3 ? "PASS" : "FAIL"}] All 9 workshop images are 100% unique`);

// 4. Painting filter match
const paintingWorkshops = workshops.filter(w => w.category === "painting");
let pass4 = paintingWorkshops.some(w => w.id === 9);
console.log(`[${pass4 ? "PASS" : "FAIL"}] Painting filter includes workshop #9 (Total painting workshops: ${paintingWorkshops.length})`);

// 5. Beginner level filter match
const beginnerWorkshops = workshops.filter(w => w.skillLevel === "Beginner");
let pass5 = beginnerWorkshops.some(w => w.id === 9);
console.log(`[${pass5 ? "PASS" : "FAIL"}] Beginner filter includes workshop #9 (Total beginner workshops: ${beginnerWorkshops.length})`);

if (pass1 && pass2 && pass3 && pass4 && pass5) {
  console.log("\nALL WATERCOLOR WORKSHOP VALIDATIONS PASSED!");
} else {
  process.exit(1);
}
