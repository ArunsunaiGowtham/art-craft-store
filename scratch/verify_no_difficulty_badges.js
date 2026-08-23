const fs = require('fs');

// Load HTML
const html = fs.readFileSync('workshops.html', 'utf8');

// Check filter buttons in HTML
const filterButtons = [...html.matchAll(/data-category="([^"]+)"/g)].map(m => m[1]);
console.log('Filter buttons present:', filterButtons);

const hasDifficultyButtons = filterButtons.some(b => ['beginner', 'intermediate', 'advanced'].includes(b));
if (!hasDifficultyButtons) {
  console.log('✅ PASS: Beginner, Intermediate, Advanced filter buttons removed from filter bar.');
} else {
  console.error('❌ FAIL: Difficulty buttons still exist in filter bar');
}

// Check JS main.js
const mainJs = fs.readFileSync('js/main.js', 'utf8');
const dataJs = fs.readFileSync('js/data.js', 'utf8');

const { JSDOM } = require('jsdom');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Execute data.js and main.js
const scriptData = document.createElement('script');
scriptData.textContent = dataJs;
document.head.appendChild(scriptData);

const scriptMain = document.createElement('script');
scriptMain.textContent = mainJs;
document.head.appendChild(scriptMain);

// Trigger DOMContentLoaded
const event = document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
document.dispatchEvent(event);

// Check all rendered workshop cards
const cards = document.querySelectorAll('.workshop-card-item');
console.log(`Rendered cards count: ${cards.length}`);

let difficultyBadgesFound = 0;
let categoryBadgesFound = 0;

cards.forEach((card, i) => {
  const cardText = card.querySelector('.card-img-top').textContent;
  console.log(`Card ${i + 1} image badges text: "${cardText.trim()}"`);
  
  if (/beginner|intermediate|advanced/i.test(cardText)) {
    difficultyBadgesFound++;
    console.error(`❌ Found difficulty badge on card ${i + 1}: ${cardText}`);
  }
  if (/painting|crafting|drawing|origami/i.test(cardText)) {
    categoryBadgesFound++;
  }
});

if (difficultyBadgesFound === 0) {
  console.log('✅ PASS: Exactly ZERO difficulty badges (Beginner, Intermediate, Advanced) found on any cards!');
} else {
  console.error(`❌ FAIL: Found ${difficultyBadgesFound} difficulty badges on cards.`);
}

if (categoryBadgesFound === cards.length) {
  console.log('✅ PASS: All cards retain their clean, respective category badge!');
} else {
  console.error('❌ FAIL: Missing category badges on some cards.');
}
