const fs = require('fs');
const path = require('path');

global.window = {};
global.document = {
    addEventListener: () => {}
};

const code = fs.readFileSync('./js/data.js', 'utf8');
eval(code);

const appData = global.window.AppData;

console.log("=== COMPREHENSIVE WORKSHOP & BLOG IMAGE AUDIT ===");
let hasErrors = false;

function checkItem(type, item) {
    const imgPath = item.image;
    if (!imgPath) {
        console.error(`[ERROR] ${type} id=${item.id} (${item.title || item.name}) has no image!`);
        hasErrors = true;
        return;
    }
    if (imgPath.startsWith('images/')) {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`[ERROR] ${type} id=${item.id} image missing on disk: ${imgPath}`);
            hasErrors = true;
        } else {
            const sz = fs.statSync(fullPath).size;
            if (sz < 1000) {
                console.error(`[ERROR] ${type} id=${item.id} image is too small (${sz} bytes): ${imgPath}`);
                hasErrors = true;
            } else {
                console.log(`[OK] [${type}] "${item.title || item.name}" -> ${imgPath} (${(sz/1024).toFixed(1)} KB)`);
            }
        }
    } else {
        console.log(`[OK-URL] [${type}] "${item.title || item.name}" -> ${imgPath.substring(0, 50)}...`);
    }
}

console.log("\n--- WORKSHOPS AUDIT (12 Workshops) ---");
appData.workshops.forEach(w => checkItem('Workshop', w));

console.log("\n--- BLOG WORKSHOPS AUDIT (Workshops Category) ---");
appData.blogPosts
    .filter(b => b.category === 'Workshops' || (b.categories && b.categories.includes('Workshops')))
    .forEach(b => checkItem('Blog-Workshop', b));

if (!hasErrors) {
    console.log("\n>>> ALL WORKSHOP & BLOG IMAGES PASSED VERIFICATION! <<<");
} else {
    console.error("\n>>> VERIFICATION FOUND ERRORS! <<<");
    process.exit(1);
}
