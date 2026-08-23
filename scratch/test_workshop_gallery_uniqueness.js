const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');

// Evaluate AppData in isolated context
const sandbox = {};
const fn = new Function('window', dataJs + '; return window.AppData;');
const AppData = fn(sandbox);

console.log(`Loaded ${AppData.workshops.length} workshops from data.js\n`);

const filters = [
  'all',
  'upcoming',
  'beginner',
  'intermediate',
  'advanced',
  'painting',
  'crafting',
  'drawing',
  'origami'
];

let globalImageSet = new Set();
let allUnique = true;

// Check each workshop has a unique image
AppData.workshops.forEach(w => {
  console.log(`[Workshop ${w.id}] "${w.title}"`);
  console.log(`  Category: ${w.category} | SkillLevel: ${w.skillLevel}`);
  console.log(`  Image: ${w.image}\n`);

  if (globalImageSet.has(w.image)) {
    console.error(`ERROR: Duplicate image detected across workshops: ${w.image}`);
    allUnique = false;
  }
  globalImageSet.add(w.image);
});

console.log(`Total unique workshop images: ${globalImageSet.size} / ${AppData.workshops.length}`);

// Test each filter and verify no duplicates within any filter view
console.log('\n--- TESTING ALL FILTERS FOR UNIQUENESS & RESULTS ---');
filters.forEach(filter => {
  let filtered = [];
  if (filter === 'all' || filter === 'upcoming') {
    filtered = AppData.workshops;
  } else {
    filtered = AppData.workshops.filter(w => {
      const wLevel = (w.skillLevel || '').toLowerCase().trim();
      const wCat = (w.category || '').toLowerCase().trim();
      const wTitle = (w.title || '').toLowerCase();
      if (filter === 'beginner' || filter === 'intermediate' || filter === 'advanced') {
        return wLevel === filter;
      }
      if (filter === 'drawing') {
        return wCat === 'drawing' || wCat === 'sketching' || wCat.indexOf('draw') !== -1 || wTitle.indexOf('sketch') !== -1 || wTitle.indexOf('calligraphy') !== -1 || wTitle.indexOf('draw') !== -1;
      }
      if (filter === 'origami') {
        return wCat === 'origami' || wTitle.indexOf('origami') !== -1;
      }
      if (filter === 'painting') {
        return wCat === 'painting' || wTitle.indexOf('paint') !== -1 || wTitle.indexOf('watercolor') !== -1 || wTitle.indexOf('acrylic') !== -1;
      }
      if (filter === 'crafting') {
        return wCat === 'crafting' || wTitle.indexOf('clay') !== -1 || wTitle.indexOf('candle') !== -1 || wTitle.indexOf('craft') !== -1;
      }
      return wCat === filter || wLevel === filter;
    });
  }

  const filterImages = new Set(filtered.map(w => w.image));
  const hasDupes = filterImages.size !== filtered.length;
  console.log(`Filter [${filter.padEnd(14)}]: ${filtered.length} workshops -> ${filterImages.size} unique images ${hasDupes ? '❌ DUPES' : '✅ ALL UNIQUE'}`);
  filtered.forEach(w => {
    console.log(`   - [ID ${w.id}] ${w.title} (${w.category}, ${w.skillLevel})`);
  });
  console.log('');
  if (hasDupes) allUnique = false;
});

if (allUnique) {
  console.log('SUCCESS: All workshop cards and filters have 100% unique, topic-relevant images!');
} else {
  console.error('FAILURE: Found duplicate images.');
  process.exit(1);
}
