const assert = require("assert");
const fs = require("fs");
const blogHtml = fs.readFileSync("blog.html", "utf8");

let renderedHtml = "";
let renderedCount = 0;
let activeCategory = "all";
let paginationHtml = "";
let pageHandlers = {};
const searchHandlers = {};
const searchInput = {
  value: "",
  addEventListener: (eventName, handler) => { searchHandlers[eventName] = handler; },
  focus: () => {}
};
const searchForm = { addEventListener: (eventName, handler) => { searchHandlers[`form-${eventName}`] = handler; } };
const categoryNames = ["All", "Art Tips", "Craft Tutorials", "DIY", "Painting", "Drawing", "Origami", "Workshops", "Product Guides", "Art & Culture"];
const paginationElement = {
  set innerHTML(value) { paginationHtml = value; pageHandlers = {}; },
  querySelectorAll: () => [...paginationHtml.matchAll(/data-page="(\d+)"/g)].map((match) => ({
    getAttribute: () => match[1],
    addEventListener: (_, handler) => { pageHandlers[match[1]] = handler; }
  }))
};

const sandbox = {
  window: { matchMedia: () => ({ matches: false, addEventListener: () => {} }), location: { search: "", pathname: "/blog.html" } },
  localStorage: { getItem: () => null, setItem: () => {} },
  URLSearchParams: function () { return { get: () => null }; },
  document: {
    documentElement: { setAttribute: () => {}, getAttribute: () => "light" },
    body: { classList: { add: () => {}, remove: () => {} } },
    addEventListener: () => {},
    getElementById: (id) => {
      if (id === "blog-container") return { set innerHTML(value) { renderedHtml = value; }, scrollIntoView: () => {} };
      if (id === "blog-count") return { set textContent(value) { renderedCount = Number(value); } };
      if (id === "blog-count-text") return { set innerHTML(value) {} };
      if (id === "blog-pagination") return paginationElement;
      if (id === "blog-search") return searchInput;
      if (id === "blog-search-form") return searchForm;
      return null;
    },
    querySelector: (selector) => {
      if (selector.includes("blog-container")) return { set innerHTML(value) { renderedHtml = value; } };
      if (selector.includes("blog-search")) return searchInput;
      if (selector.includes("blog-category-btn.active")) return { getAttribute: () => activeCategory };
      return null;
    },
    querySelectorAll: (selector) => selector.includes("blog-category-btn")
      ? categoryNames.map((name) => ({
        getAttribute: () => name,
        addEventListener: () => {},
        classList: { toggle: (_, isActive) => { if (isActive) activeCategory = name; } }
      }))
      : []
  }
};

global.window = sandbox.window;
global.localStorage = sandbox.localStorage;
global.document = sandbox.document;
eval(fs.readFileSync("js/data.js", "utf8"));
eval(`(function(window, document) { ${fs.readFileSync("js/main.js", "utf8")} })(sandbox.window, sandbox.document);`);

const posts = sandbox.window.AppData.blogPosts;
const sequence = ["all", "Art Tips", "Craft Tutorials", "DIY", "Painting", "Drawing", "Origami", "Workshops", "Product Guides", "Art & Culture", "all"];

sequence.forEach((category) => {
  sandbox.window.filterBlogPosts(category, "");
  const expected = category === "all" ? posts : posts.filter((post) => post.category === category);
  const ids = [...renderedHtml.matchAll(/blog-details\.html\?id=(\d+)/g)].map((match) => Number(match[1]));
  const uniqueIds = [...new Set(ids)];

  assert.strictEqual(renderedCount, expected.length, `${category}: incorrect article count`);
  assert.deepStrictEqual(uniqueIds, expected.slice(0, 12).map((post) => post.id), `${category}: incorrect article IDs`);
  expected.slice(0, 12).forEach((post) => {
    assert(renderedHtml.includes(`src="${post.image}"`), `${category}: missing exact image for ${post.id}`);
    assert(renderedHtml.includes(post.author.name), `${category}: missing author for ${post.id}`);
    assert(renderedHtml.includes(post.date), `${category}: missing date for ${post.id}`);
    assert(renderedHtml.includes(post.readTime), `${category}: missing reading time for ${post.id}`);
  });
  assert.strictEqual(activeCategory.toLowerCase(), category === "all" ? "all" : category.toLowerCase(), `${category}: active button mismatch`);
});

assert(pageHandlers["2"], "All: missing second-page control");
pageHandlers["2"].call({ getAttribute: () => "2" }, { preventDefault: () => {} });
const secondPageIds = [...new Set([...renderedHtml.matchAll(/blog-details\.html\?id=(\d+)/g)].map((match) => Number(match[1])))];
assert.deepStrictEqual(secondPageIds, posts.slice(12).map((post) => post.id), "All: page 2 contains wrong or duplicate articles");
assert.strictEqual(renderedCount, posts.length, "All: count changed on page 2");

sandbox.window.filterBlogPosts("Art Tips", "");
const artTipIds = [...new Set([...renderedHtml.matchAll(/blog-details\.html\?id=(\d+)/g)].map((match) => Number(match[1])))];
assert.deepStrictEqual(artTipIds, posts.filter((post) => post.category === "Art Tips").map((post) => post.id), "Category change did not reset to page 1");

const searchMatches = (category, query) => posts.filter((post) => {
  const matchesCategory = category === "all" || post.category === category;
  const haystack = [post.title, post.excerpt, post.content, post.category, post.categories.join(" "), post.author.name].join(" ").toLowerCase();
  return matchesCategory && haystack.includes(query.toLowerCase());
});

sandbox.window.filterBlogPosts("all", "water control");
assert.strictEqual(renderedCount, searchMatches("all", "water control").length, "Content search returned incorrect results");
sandbox.window.filterBlogPosts("Painting", "watercolor");
assert.strictEqual(renderedCount, searchMatches("Painting", "watercolor").length, "Category + search returned incorrect results");
sandbox.window.filterBlogPosts("Painting", "no matching article phrase");
assert.strictEqual(renderedCount, 0, "No-results search did not clear cards");
assert(renderedHtml.includes("No articles found"), "No-results message was not rendered");
sandbox.window.filterBlogPosts("Painting", "");
assert.strictEqual(renderedCount, searchMatches("Painting", "").length, "Clearing search did not restore selected category");

activeCategory = "all";
searchInput.value = "10 Essential Tips for Watercolor Beginners";
searchHandlers["form-submit"]({ preventDefault: () => {} });
assert.strictEqual(renderedCount, 1, "Search form submit did not find an exact title");
searchInput.value = "charcoal";
searchHandlers.keydown({ key: "Enter", preventDefault: () => {} });
assert.strictEqual(renderedCount, 1, "Enter key did not run the article search");

assert(blogHtml.indexOf("blog-search-section") < blogHtml.indexOf("blog-filter-section"), "Search section is not above category filters");

console.log(`Verified All → every exact category → All, pagination, search, and no-results behavior for ${posts.length} articles.`);
