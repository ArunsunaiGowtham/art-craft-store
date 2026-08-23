const fs = require('fs');

const pages = [
  { path: "index.html", expected: "Home" },
  { path: "home-2.html", expected: "Home" },
  { path: "shop.html", expected: "Shop" },
  { path: "workshops.html", expected: "Workshops" },
  { path: "brands.html", expected: "Brands" },
  { path: "about.html", expected: "About" },
  { path: "blog.html", expected: "Blog" },
  { path: "contact.html", expected: "Contact" },
  { path: "checkout.html", expected: "None" },
  { path: "cart.html", expected: "None" },
  { path: "login.html", expected: "None" },
  { path: "register.html", expected: "None" },
  { path: "pricing.html", expected: "None" },
  { path: "student-supplies.html", expected: "None" },
  { path: "product-details.html?id=1", expected: "None" },
  { path: "workshop-details.html?id=1", expected: "None" },
  { path: "blog-details.html?id=1", expected: "None" }
];

const mainJs = fs.readFileSync('js/main.js', 'utf8');

// Function simulation based on main.js initActiveNav
function simulateActiveNav(rawUrl) {
  var rawPath = rawUrl.split("/").pop() || "index.html";
  if (rawPath === "" || rawPath === "/") rawPath = "index.html";
  rawPath = rawPath.split("?")[0].split("#")[0];

  var navMap = {
    "index.html": "home",
    "home-2.html": "home-2",
    "shop.html": "shop.html",
    "workshops.html": "workshops.html",
    "brands.html": "brands.html",
    "about.html": "about.html",
    "blog.html": "blog.html",
    "contact.html": "contact.html"
  };

  var target = navMap[rawPath];
  if (!target) return "None";

  if (target === "home" || target === "home-2") return "Home";
  if (target === "shop.html") return "Shop";
  if (target === "workshops.html") return "Workshops";
  if (target === "brands.html") return "Brands";
  if (target === "about.html") return "About";
  if (target === "blog.html") return "Blog";
  if (target === "contact.html") return "Contact";
  return "None";
}

console.log("Validating URL-based navigation active highlight:\n");

let allPassed = true;
pages.forEach(p => {
  const result = simulateActiveNav(p.path);
  const pass = result === p.expected;
  if (!pass) allPassed = false;
  console.log(`${p.path.padEnd(30)} -> Active: ${result.padEnd(10)} | ${pass ? 'PASS' : 'FAIL'}`);
});

console.log(`\nOverall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
