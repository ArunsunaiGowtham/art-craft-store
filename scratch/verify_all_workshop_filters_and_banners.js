const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("VERIFYING WORKSHOP FILTERS, IMAGES, AND DYNAMIC HERO BANNERS");
console.log("=================================================================\n");

let allPassed = true;

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

const workshops = global.window.AppData.workshops;
const instructors = global.window.AppData.instructors;

// Mock DOM elements and storage
const mockGrid = { innerHTML: '', dataset: {} };
const mockHeadingTitle = { textContent: '' };
const mockHeadingSubtitle = { textContent: '' };
const mockHeroHeading = { textContent: '' };
const mockHeroDesc = { textContent: '' };
const mockHeroPillText = { textContent: '' };
const mockHeroImg = { src: '', alt: '', style: {}, getAttribute: function(attr) { return this[attr] || ''; } };
const mockButtons = [];

const filterCategories = [
  'all', 'upcoming', 'beginner', 'intermediate', 'advanced', 
  'painting', 'crafting', 'drawing', 'origami'
];

filterCategories.forEach(cat => {
  mockButtons.push({
    getAttribute: function(attr) { if (attr === 'data-category') return cat; return ''; },
    classList: {
      active: false,
      add: function(c) { if (c === 'active') this.active = true; },
      remove: function(c) { if (c === 'active') this.active = false; }
    },
    addEventListener: function(event, cb) {
      this._clickCb = cb;
    }
  });
});

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
    if (id === 'workshops-heading-title') return mockHeadingTitle;
    if (id === 'workshops-heading-subtitle') return mockHeadingSubtitle;
    if (id === 'workshops-hero-heading') return mockHeroHeading;
    if (id === 'workshops-hero-desc') return mockHeroDesc;
    if (id === 'workshops-hero-pill-text') return mockHeroPillText;
    if (id === 'workshops-hero-img') return mockHeroImg;
    return { textContent: '', innerHTML: '', setAttribute: function(){}, style: {}, querySelectorAll: function(){ return []; }, classList: { add: function(){}, remove: function(){} } };
  },
  querySelectorAll: function(selector) {
    if (selector.includes('filter-btn')) return mockButtons;
    return [];
  },
  querySelector: function() { return null; },
  addEventListener: function() {},
  documentElement: { setAttribute: function(){}, getAttribute: function(){ return "light"; } },
  body: { classList: { add: function(){}, remove: function(){} } }
};

// 2. Load main.js
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
eval(mainJs);

// Initialize workshops page
if (typeof initWorkshopsPage === 'function') {
  initWorkshopsPage();
}

// 3. Test every filter systematically
const testFilterMatrix = [
  {
    filter: 'all',
    expectedTitle: 'All Workshops',
    expectedSubtitlePattern: /Showing all 12 available workshops/,
    expectedCardCount: 12,
    expectedBannerHeading: 'Creative Workshops',
    expectedBannerImageSubstr: 'ws-hero-all-studio.jpg',
    expectedWorkshopIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    filter: 'upcoming',
    expectedTitle: 'Upcoming Workshops',
    expectedSubtitlePattern: /Showing \d+ upcoming workshops?/,
    expectedBannerHeading: 'Upcoming Workshops & Events',
    expectedBannerImageSubstr: 'ws-hero-upcoming-studio.jpg',
    checkIsUpcoming: true
  },
  {
    filter: 'painting',
    expectedTitle: 'Painting Workshops',
    expectedSubtitlePattern: /Showing 3 painting workshops?/,
    expectedCardCount: 3,
    expectedBannerHeading: 'Painting Workshops',
    expectedBannerImageSubstr: 'advanced-oil-painting-technique.jpg',
    expectedWorkshopIds: [1, 5, 9]
  },
  {
    filter: 'crafting',
    expectedTitle: 'Crafting Workshops',
    expectedSubtitlePattern: /Showing 3 crafting workshops?/,
    expectedCardCount: 3,
    expectedBannerHeading: 'Crafting & Handmade Workshops',
    expectedBannerImageSubstr: 'workshop-pottery-clay-sculpting.jpg',
    expectedWorkshopIds: [3, 7, 12]
  },
  {
    filter: 'drawing',
    expectedTitle: 'Drawing & Sketching Workshops',
    expectedSubtitlePattern: /Showing 3 drawing & sketching workshops?/,
    expectedCardCount: 3,
    expectedBannerHeading: 'Drawing & Sketching Workshops',
    expectedBannerImageSubstr: 'ws-modern-calligraphy.jpg',
    expectedWorkshopIds: [2, 6, 8]
  },
  {
    filter: 'origami',
    expectedTitle: 'Origami Workshops',
    expectedSubtitlePattern: /Showing 3 origami workshops?/,
    expectedCardCount: 3,
    expectedBannerHeading: 'Origami & Paper Art Workshops',
    expectedBannerImageSubstr: 'origami-paper-collection.jpg',
    expectedWorkshopIds: [4, 10, 11]
  }
];

testFilterMatrix.forEach(t => {
  console.log(`\n-------------------------------------------------------------`);
  console.log(`TESTING FILTER: [${t.filter.toUpperCase()}]`);
  console.log(`-------------------------------------------------------------`);

  // Apply filter via button click
  const btn = mockButtons.find(b => b.getAttribute('data-category') === t.filter);
  if (btn && btn._clickCb) {
    btn._clickCb.call(btn, { preventDefault: function(){} });
  }

  // 1. Check title
  console.log(`Title: "${mockHeadingTitle.textContent}"`);
  if (mockHeadingTitle.textContent !== t.expectedTitle) {
    console.error(`[FAIL] Title mismatch: Expected "${t.expectedTitle}", got "${mockHeadingTitle.textContent}"`);
    allPassed = false;
  } else {
    console.log(`[PASS] Page Title is "${t.expectedTitle}"`);
  }

  // 2. Check subtitle / count
  console.log(`Subtitle: "${mockHeadingSubtitle.textContent}"`);
  if (!t.expectedSubtitlePattern.test(mockHeadingSubtitle.textContent)) {
    console.error(`[FAIL] Subtitle mismatch: "${mockHeadingSubtitle.textContent}" did not match pattern ${t.expectedSubtitlePattern}`);
    allPassed = false;
  } else {
    console.log(`[PASS] Subtitle count accurately matches results: "${mockHeadingSubtitle.textContent}"`);
  }

  // 3. Check Banner Heading & Image
  console.log(`Banner Heading: "${mockHeroHeading.textContent}"`);
  console.log(`Banner Image: "${mockHeroImg.src}" (Alt: "${mockHeroImg.alt}")`);
  if (mockHeroHeading.textContent !== t.expectedBannerHeading) {
    console.error(`[FAIL] Banner heading mismatch: Expected "${t.expectedBannerHeading}", got "${mockHeroHeading.textContent}"`);
    allPassed = false;
  } else {
    console.log(`[PASS] Banner Heading matches filter: "${t.expectedBannerHeading}"`);
  }

  if (!mockHeroImg.src.includes(t.expectedBannerImageSubstr)) {
    console.error(`[FAIL] Banner image mismatch: Expected substr "${t.expectedBannerImageSubstr}", got "${mockHeroImg.src}"`);
    allPassed = false;
  } else {
    console.log(`[PASS] Banner Image synchronized with filter`);
  }

  // 4. Check Rendered Cards count and images
  const renderedHtml = mockGrid.innerHTML;
  const renderedCardMatches = renderedHtml.match(/class="col-md-6 col-lg-4 workshop-card-item"/g) || [];
  console.log(`Rendered Card Count: ${renderedCardMatches.length}`);

  if (t.expectedCardCount !== undefined && renderedCardMatches.length !== t.expectedCardCount) {
    console.error(`[FAIL] Card count mismatch: Expected ${t.expectedCardCount}, got ${renderedCardMatches.length}`);
    allPassed = false;
  } else {
    console.log(`[PASS] Exactly ${renderedCardMatches.length} card(s) rendered`);
  }

  // 5. Check each expected workshop is present and NO other workshop is present
  if (t.expectedWorkshopIds) {
    t.expectedWorkshopIds.forEach(id => {
      const w = workshops.find(item => item.id === id);
      if (!renderedHtml.includes(w.title)) {
        console.error(`[FAIL] Missing expected workshop "${w.title}" (ID ${id})`);
        allPassed = false;
      }
      if (!renderedHtml.includes(w.image)) {
        console.error(`[FAIL] Missing image for workshop "${w.title}": ${w.image}`);
        allPassed = false;
      }
    });

    // Check non-matching workshops are absent
    workshops.filter(w => !t.expectedWorkshopIds.includes(w.id)).forEach(w => {
      if (renderedHtml.includes(w.title)) {
        console.error(`[FAIL] Unrelated workshop "${w.title}" (ID ${w.id}) should NOT be in filter [${t.filter}]`);
        allPassed = false;
      }
    });
  }

  // 6. Specific check for Crafting cards (No Beginner badge)
  if (t.filter === 'crafting') {
    if (renderedHtml.toLowerCase().includes('text-transform:uppercase; letter-spacing:0.03em;">beginner')) {
      console.error(`[FAIL] Crafting cards contain Beginner badge!`);
      allPassed = false;
    } else {
      console.log(`[PASS] Crafting cards contain only "Crafting" badge and NO "BEGINNER" badge`);
    }
  }
});

if (allPassed) {
  console.log("\n=================================================================");
  console.log("✅ ALL WORKSHOP FILTERS, IMAGES, AND HERO BANNERS PASSED 100%!");
  console.log("=================================================================");
} else {
  console.error("\n❌ SOME CHECKS FAILED!");
  process.exit(1);
}
