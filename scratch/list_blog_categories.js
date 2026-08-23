const fs = require('fs');

const dataJs = fs.readFileSync('./js/data.js', 'utf8');

const sandbox = {};
const fn = new Function('window', dataJs + '; return window.AppData;');
const AppData = fn(sandbox);

console.log("Total posts:", AppData.blogPosts.length);
const byCategory = {};
AppData.blogPosts.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    console.log(`[${p.category}] #${p.id} "${p.title}" by ${p.author}`);
});
console.log("\nCounts by category:", byCategory);
