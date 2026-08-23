const fs = require('fs');

global.window = {};
global.document = {
    addEventListener: () => {}
};

const code = fs.readFileSync('./js/data.js', 'utf8');
eval(code);

const appData = global.window.AppData;
const posts = appData.blogPosts;
const authors = appData.blogAuthors;

console.log(`=== CHECKING BLOG POST AUTHORS (Total Posts: ${posts.length}) ===`);

const authorNames = [];
const authorAvatars = [];
const postAuthorIds = [];

posts.forEach((p, idx) => {
    console.log(`Post #${p.id}: "${p.title.substring(0, 40)}..." -> Author: ${p.author.name} (id: ${p.authorId})`);
    authorNames.push(p.author.name);
    authorAvatars.push(p.author.avatar);
    postAuthorIds.push(p.authorId);
});

// Check duplicates in author names
const nameCounts = {};
authorNames.forEach(n => nameCounts[n] = (nameCounts[n] || 0) + 1);
const duplicateNames = Object.entries(nameCounts).filter(([k, v]) => v > 1);

// Check duplicates in author avatars
const avatarCounts = {};
authorAvatars.forEach(a => avatarCounts[a] = (avatarCounts[a] || 0) + 1);
const duplicateAvatars = Object.entries(avatarCounts).filter(([k, v]) => v > 1);

console.log("\n--- VERIFICATION RESULTS ---");
console.log(`Total unique author names: ${Object.keys(nameCounts).length} / ${posts.length}`);
console.log(`Total unique author avatars: ${Object.keys(avatarCounts).length} / ${posts.length}`);

if (duplicateNames.length > 0) {
    console.error("DUPLICATE AUTHOR NAMES FOUND:", duplicateNames);
    process.exit(1);
} else {
    console.log("SUCCESS: 0 duplicate author names! Every single blog post has a unique author.");
}

if (duplicateAvatars.length > 0) {
    console.error("DUPLICATE AUTHOR AVATARS FOUND:", duplicateAvatars);
    process.exit(1);
} else {
    console.log("SUCCESS: 0 duplicate author avatars! Every author has a distinct portrait.");
}
