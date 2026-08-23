const fs = require('fs');

global.window = {};
global.document = {
    addEventListener: () => {}
};

const code = fs.readFileSync('./js/data.js', 'utf8');
eval(code);

const appData = global.window.AppData;

console.log(`Products: ${appData.products.length}`);
console.log(`Workshops: ${appData.workshops.length}`);
console.log(`Blog Posts: ${appData.blogPosts.length}`);

const pImgs = appData.products.map(p => ({ type: 'product', id: p.id, title: p.name, img: p.image }));
const wImgs = appData.workshops.map(w => ({ type: 'workshop', id: w.id, title: w.title, img: w.image }));
const bImgs = appData.blogPosts.map(b => ({ type: 'blog', id: b.id, title: b.title, img: b.image }));

const all = [...pImgs, ...wImgs, ...bImgs];
const map = {};
all.forEach(item => {
    if (!map[item.img]) map[item.img] = [];
    map[item.img].push(item);
});

const dupes = Object.entries(map).filter(([k, v]) => v.length > 1);
console.log("\n--- DUPLICATES REPORT ---");
if (dupes.length === 0) {
    console.log("ALL IMAGES ARE 100% UNIQUE!");
} else {
    dupes.forEach(([img, items]) => {
        console.log(`\nDuplicate Image: ${img}`);
        items.forEach(i => console.log(`  - [${i.type}] ${i.title}`));
    });
}
