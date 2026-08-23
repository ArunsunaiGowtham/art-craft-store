const fs = require('fs');

global.window = {};
global.document = {
    addEventListener: () => {}
};

const code = fs.readFileSync('./js/data.js', 'utf8');
eval(code);

const posts = global.window.AppData.blogPosts;

const categories = ["all", "Art Tips", "Craft Tutorials", "DIY", "Painting", "Drawing", "Origami", "Workshops", "Product Guides", "Art & Culture"];

console.log("=== BLOG CATEGORY FILTER AUDIT ===");
categories.forEach(cat => {
    let filtered;
    if (cat === "all") {
        filtered = posts;
    } else {
        filtered = posts.filter(p => p.category === cat || (p.categories && p.categories.includes(cat)));
    }
    console.log(`\nCategory [${cat}]: ${filtered.length} articles`);
    filtered.forEach(p => {
        console.log(`  - #${p.id} "${p.title}" | Author: ${p.author.name} | Img: ${p.image}`);
    });
});
