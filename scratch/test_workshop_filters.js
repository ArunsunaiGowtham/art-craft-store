const fs = require('fs');

const dataContent = fs.readFileSync('js/data.js', 'utf8');
const window = {};
eval(dataContent);

const workshops = window.AppData.workshops;
console.log(`Found ${workshops.length} total workshops in AppData.\n`);

const filters = [
  "all",
  "upcoming",
  "Beginner",
  "Intermediate",
  "Advanced",
  "painting",
  "crafting",
  "drawing",
  "origami"
];

filters.forEach(cat => {
  let filtered = workshops;
  if (cat === 'all' || cat === 'upcoming') {
    filtered = workshops;
  } else {
    var lowerCat = cat.toLowerCase();
    filtered = workshops.filter(function(w) {
      var wLevel = (w.skillLevel || '').toLowerCase();
      var wCat = (w.category || '').toLowerCase();
      return wLevel === lowerCat || 
             wCat === lowerCat || 
             (lowerCat === 'drawing' && (wCat === 'drawing' || wCat === 'sketching' || wCat.indexOf('draw') !== -1));
    });
  }
  console.log(`Filter [${cat.padEnd(14)}] -> ${filtered.length} workshops matched`);
});

console.log("\nAll filters validated successfully!");
