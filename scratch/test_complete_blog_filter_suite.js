const fs = require('fs');
global.localStorage = { getItem: () => null, setItem: () => {} };
global.window = { matchMedia: () => ({ matches: false, addEventListener: () => {} }) };
global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
  body: { classList: { add: () => {}, remove: () => {} } },
  addEventListener: () => {}
};

const mainCode = fs.readFileSync('js/main.js', 'utf8');
const dataCode = fs.readFileSync('js/data.js', 'utf8');
const blogHtml = fs.readFileSync('blog.html', 'utf8');

// Simulated environment
let countTextVal = "";
let countVal = "";
let containerHtml = "";
let paginationHtml = "";
let activeCategoryAttr = "all";

const sandbox = {
  window: {
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    location: { search: "", pathname: "/blog.html" },
    URLSearchParams: function() { return { get: () => null }; }
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {
    documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
    body: { classList: { add: () => {}, remove: () => {} } },
    getElementById: function(id) {
      if (id === "blog-count") return { set textContent(v) { countVal = v; } };
      if (id === "blog-count-text") return { set innerHTML(v) { countTextVal = v; } };
      if (id === "blog-container") return { set innerHTML(v) { containerHtml = v; }, scrollIntoView: function() {} };
      if (id === "blog-pagination") return { set innerHTML(v) { paginationHtml = v; }, querySelectorAll: function() { return []; } };
      if (id === "blog-search") return { value: "", addEventListener: () => {} };
      return null;
    },
    querySelector: function(sel) {
      if (sel.includes("blog-container")) return { set innerHTML(v) { containerHtml = v; } };
      if (sel.includes("blog-category-btn.active")) return { getAttribute: function() { return activeCategoryAttr; } };
      if (sel.includes("blog-search")) return { value: "", addEventListener: () => {} };
      return null;
    },
    querySelectorAll: function(sel) {
      if (sel.includes("blog-category-btn")) {
        return [
          { getAttribute: () => "all", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "all"; } } },
          { getAttribute: () => "Art Tips", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Art Tips"; } } },
          { getAttribute: () => "Craft Tutorials", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Craft Tutorials"; } } },
          { getAttribute: () => "DIY", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "DIY"; } } },
          { getAttribute: () => "Painting", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Painting"; } } },
          { getAttribute: () => "Drawing", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Drawing"; } } },
          { getAttribute: () => "Origami", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Origami"; } } },
          { getAttribute: () => "Workshops", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Workshops"; } } },
          { getAttribute: () => "Product Guides", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Product Guides"; } } },
          { getAttribute: () => "Art & Culture", addEventListener: () => {}, classList: { toggle: (cls, act) => { if (act) activeCategoryAttr = "Art & Culture"; } } }
        ];
      }
      return [];
    },
    addEventListener: function() {}
  },
  location: { search: "" },
  URLSearchParams: function() { return { get: () => null }; }
};

// Evaluate scripts
eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));
eval(`(function(window, document) { ${mainCode} })(sandbox.window, sandbox.document);`);

const filterBlogPosts = sandbox.window.filterBlogPosts;
const blogPosts = sandbox.window.AppData.blogPosts;

console.log("=== RUNNING FULL BLOG FILTER TEST SUITE ===\n");

// 1. Initial / All filter
filterBlogPosts("all", "");
console.log("1. Selected 'All':");
console.log(`   Count text: "${countTextVal}" (count: ${countVal})`);
let pass1 = countVal === 8;
console.log(`   [${pass1 ? "PASS" : "FAIL"}] All returns 8 articles`);

// 2. Iterate through each of the 9 categories and back to All
const categories = [
  "Art Tips",
  "Craft Tutorials",
  "DIY",
  "Painting",
  "Drawing",
  "Origami",
  "Workshops",
  "Product Guides",
  "Art & Culture"
];

let allCategoryTestsPass = true;
categories.forEach(cat => {
  filterBlogPosts(cat, "");
  const catCount = countVal;
  console.log(`2. Selected category "${cat}": count = ${catCount}`);
  if (catCount <= 0 || catCount > 8) {
    allCategoryTestsPass = false;
  }
  
  // Switch back to All
  filterBlogPosts("all", "");
  if (countVal !== 8) {
    console.log(`   ERROR: Resetting to All failed after ${cat}! (got ${countVal})`);
    allCategoryTestsPass = false;
  }
});
console.log(`   [${allCategoryTestsPass ? "PASS" : "FAIL"}] Category switching -> All restoration across all 9 categories`);

// 3. Combined Category + Search
filterBlogPosts("Painting", "watercolor");
console.log(`3. Filter 'Painting' + search 'watercolor': count = ${countVal}`);
let pass3 = countVal >= 1;
console.log(`   [${pass3 ? "PASS" : "FAIL"}] Category + search filters intersection`);

// 4. Reset to All with search
filterBlogPosts("all", "");
console.log(`4. Reset to All: count = ${countVal}`);
let pass4 = countVal === 8;
console.log(`   [${pass4 ? "PASS" : "FAIL"}] Reset to All restores full 8 articles`);

if (pass1 && allCategoryTestsPass && pass3 && pass4) {
  console.log("\nALL BLOG FILTER SUITE TESTS PASSED SUCCESSFULLY!");
} else {
  process.exit(1);
}
