const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

const pages = [
  { url: 'https://artcraftstore.com/index.html', expected: ['Home', 'Home 1'] },
  { url: 'https://artcraftstore.com/home-2.html', expected: ['Home', 'Home 2'] },
  { url: 'https://artcraftstore.com/shop.html', expected: ['Shop'] },
  { url: 'https://artcraftstore.com/workshops.html', expected: ['Workshops'] },
  { url: 'https://artcraftstore.com/brands.html', expected: ['Brands'] },
  { url: 'https://artcraftstore.com/about.html', expected: ['About'] },
  { url: 'https://artcraftstore.com/blog.html', expected: ['Blog'] },
  { url: 'https://artcraftstore.com/contact.html', expected: ['Contact'] },
  { url: 'https://artcraftstore.com/checkout.html', expected: [] },
  { url: 'https://artcraftstore.com/cart.html', expected: [] },
  { url: 'https://artcraftstore.com/login.html', expected: [] },
  { url: 'https://artcraftstore.com/register.html', expected: [] },
  { url: 'https://artcraftstore.com/product-details.html?id=1', expected: [] }
];

console.log("Testing JavaScript active nav highlighting across all pages:\n");

let allPassed = true;

pages.forEach(({ url, expected }) => {
  const dom = new JSDOM(html, { url, runScripts: "outside-only" });
  dom.window.eval(mainJs);

  const activeLinks = Array.from(dom.window.document.querySelectorAll('.navbar-nav .nav-link.active, .navbar-nav .dropdown-item.active'))
    .map(el => el.textContent.replace(/\s+/g, ' ').trim().replace(' Home 1', '').replace(' Home 2', '').split(' ')[0]);

  const activeUnique = Array.from(new Set(activeLinks)).filter(Boolean);
  const path = url.split('/').pop();

  console.log(`${path.padEnd(25)} -> Active: ${JSON.stringify(activeUnique)}`);
});

console.log("\nActive navbar navigation test complete!");
