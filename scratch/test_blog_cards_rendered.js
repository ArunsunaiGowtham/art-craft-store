const fs = require('fs');

global.localStorage = { getItem: () => null, setItem: () => {} };
global.window = {
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  location: { search: "", pathname: "/blog.html" },
  URLSearchParams: function() { return { get: () => null }; }
};
global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
  body: { classList: { add: () => {}, remove: () => {} } },
  addEventListener: () => {}
};

const mainCode = fs.readFileSync('js/main.js', 'utf8');
const dataCode = fs.readFileSync('js/data.js', 'utf8');

let renderedHtml = "";
let countVal = "";

const testContainer = {
  set innerHTML(html) {
    renderedHtml = html;
  },
  get innerHTML() {
    return renderedHtml;
  },
  dataset: {}
};

const sandbox = {
  window: global.window,
  localStorage: global.localStorage,
  document: {
    documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
    body: { classList: { add: () => {}, remove: () => {} } },
    getElementById: function(id) {
      if (id === "blog-container") return testContainer;
      if (id === "blog-count") return { set textContent(v) { countVal = v; } };
      if (id === "blog-count-text") return { set innerHTML(v) {} };
      if (id === "blog-pagination") return { set innerHTML(v) {} };
      if (id === "blog-search") return { value: "", addEventListener: () => {} };
      return null;
    },
    querySelector: function(sel) {
      if (sel.includes("blog-container")) return testContainer;
      if (sel.includes("blog-search")) return { value: "", addEventListener: () => {} };
      if (sel.includes("blog-category-btn.active")) return { getAttribute: () => "all" };
      return null;
    },
    querySelectorAll: function(sel) {
      if (sel.includes("blog-category-btn")) {
        return [
          { getAttribute: () => "all", addEventListener: () => {}, classList: { toggle: () => {} } }
        ];
      }
      return [];
    },
    addEventListener: () => {}
  }
};

eval(dataCode.replace(/window\.AppData/g, 'sandbox.window.AppData'));
eval(`(function(window, document) { ${mainCode} })(sandbox.window, sandbox.document);`);

console.log("=== VERIFYING BLOG CARD RENDERING WHEN 'ALL' IS SELECTED ===");

sandbox.window.filterBlogPosts("all", "");

console.log(`Dynamic count value: ${countVal}`);

// Count rendered card elements in HTML
const cardMatches = [...renderedHtml.matchAll(/<div class="col-md-6 col-lg-4 d-flex">/g)];
console.log(`Rendered blog card columns: ${cardMatches.length}`);

const linkMatches = [...renderedHtml.matchAll(/href="blog-details\.html\?id=(\d+)"/g)];
console.log(`Rendered blog links: ${linkMatches.length} (IDs: ${linkMatches.map(m => m[1]).join(', ')})`);

const imgMatches = [...renderedHtml.matchAll(/<img src="([^"]+)"/g)];
console.log(`Rendered images: ${imgMatches.length}`);

let passAll = cardMatches.length === 8 && linkMatches.length === 16 && countVal === 8;
console.log(`[${passAll ? "PASS" : "FAIL"}] All 8 articles are fully rendered directly below count`);

if (!passAll) {
  process.exit(1);
} else {
  console.log("\nALL ARTICLE CARDS SUCCESSFULLY RENDERED!");
}
