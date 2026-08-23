const fs = require('fs');

const indexHtml = fs.readFileSync('./index.html', 'utf8');

console.log("=== CHECKING STUDENT SUPPLIES SECTION IN index.html ===");

const hasSection = indexHtml.includes('id="student-supplies-preview"');
const hasSubtitle = indexHtml.includes('Premium quality art essentials tailored for classrooms');
const hasBadge = indexHtml.includes('CLASSROOM &amp; STUDIO ESSENTIALS');
const has2ColChecklist = indexHtml.includes('col-sm-6') && indexHtml.includes('Drawing &amp; sketchpads');
const hasCards = indexHtml.includes('Color Pencils (36pk)') && indexHtml.includes('Washable Markers') && indexHtml.includes('Sketching Kit') && indexHtml.includes('Complete Art Kit');

console.log("Section ID present:", hasSection);
console.log("Subtitle present:", hasSubtitle);
console.log("Category badge present:", hasBadge);
console.log("2-column checklist present:", has2ColChecklist);
console.log("All 4 product cards present:", hasCards);

if (hasSection && hasSubtitle && hasBadge && has2ColChecklist && hasCards) {
    console.log("\nALL STRUCTURE & ALIGNMENT CHECKS PASSED!");
} else {
    console.error("\nSOME CHECKS FAILED!");
    process.exit(1);
}
