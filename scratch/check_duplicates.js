const fs = require('fs');

const dataFile = fs.readFileSync('./js/data.js', 'utf8');

// Simple regex extraction of objects
function extractArray(name) {
    const startIdx = dataFile.indexOf(`${name}: [`);
    if (startIdx === -1) return [];
    let endIdx = dataFile.indexOf('],', startIdx);
    if (endIdx === -1) endIdx = dataFile.indexOf(']', startIdx);
    const content = dataFile.substring(startIdx, endIdx + 1);
    
    const imgMatches = [];
    const regex = /image:\s*["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        imgMatches.push(match[1]);
    }
    return imgMatches;
}

const productsImgs = extractArray('products');
const workshopsImgs = extractArray('workshops');
const blogImgs = extractArray('blogPosts');

console.log(`Found ${productsImgs.length} product images, ${workshopsImgs.length} workshop images, ${blogImgs.length} blog images.`);

const allImages = [...productsImgs, ...workshopsImgs, ...blogImgs];
const counts = {};
allImages.forEach(img => {
    counts[img] = (counts[img] || 0) + 1;
});

const duplicates = Object.entries(counts).filter(([k, v]) => v > 1);
if (duplicates.length > 0) {
    console.log("Duplicates found:", duplicates);
} else {
    console.log("SUCCESS: ZERO duplicate images found across products, workshops, and blog posts!");
}
