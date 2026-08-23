const fs = require('fs');
const path = require('path');

global.window = {};
global.document = {
    addEventListener: () => {}
};

const code = fs.readFileSync('./js/data.js', 'utf8');
eval(code);

const appData = global.window.AppData;

console.log("================ FINAL AUDIT ================");
console.log(`Total Products: ${appData.products.length}`);
console.log(`Total Workshops: ${appData.workshops.length}`);
console.log(`Total Blog Posts: ${appData.blogPosts.length}`);

// 1. Check all images exist
let missing = 0;
const allItems = [
    ...appData.products.map(p => ({ category: 'Product', id: p.id, title: p.name, image: p.image })),
    ...appData.workshops.map(w => ({ category: 'Workshop', id: w.id, title: w.title, image: w.image })),
    ...appData.blogPosts.map(b => ({ category: 'Blog', id: b.id, title: b.title, image: b.image }))
];

allItems.forEach(item => {
    if (item.image.startsWith('images/')) {
        const full = path.join(__dirname, '..', item.image);
        if (!fs.existsSync(full)) {
            console.error(`MISSING FILE: [${item.category}] ${item.title} -> ${item.image}`);
            missing++;
        }
    }
});

// 2. Check duplicates
const imgCounts = {};
allItems.forEach(item => {
    imgCounts[item.image] = (imgCounts[item.image] || 0) + 1;
});
const dupes = Object.entries(imgCounts).filter(([k, v]) => v > 1);

console.log(`\nMissing images count: ${missing}`);
console.log(`Duplicate images count: ${dupes.length}`);

console.log("\n--- WORKSHOPS (12) ---");
appData.workshops.forEach(w => {
    console.log(`WS #${w.id} [${w.category}] "${w.title}" -> ${w.image}`);
});

console.log("\n--- WORKSHOP BLOG ARTICLES (3) ---");
appData.blogPosts
    .filter(b => b.category === 'Workshops' || (b.categories && b.categories.includes('Workshops')))
    .forEach(b => {
        console.log(`Blog #${b.id} "${b.title}" -> ${b.image} (Author: ${b.authorId})`);
    });

console.log("\n=============================================");
