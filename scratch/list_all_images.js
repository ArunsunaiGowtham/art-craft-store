const fs = require('fs');
const path = require('path');

const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
global.window = {};
eval(dataJs);

console.log("=== WORKSHOP IMAGES IN DATA.JS ===");
global.window.AppData.workshops.forEach(w => {
  console.log(`\n[ID ${w.id}] ${w.title} (${w.category}, ${w.skillLevel})`);
  console.log(`  Current Image: ${w.image}`);
  console.log(`  Description: ${w.description}`);
});

console.log("\n=== HERO BANNER IMAGES IN MAIN.JS ===");
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
const bannerMatch = mainJs.match(/var workshopBannerMap = \{([\s\S]*?)\};/);
if (bannerMatch) {
  eval("var bannerMap = {" + bannerMatch[1] + "};");
  Object.entries(bannerMap).forEach(([k, v]) => {
    console.log(`\nFilter: [${k}]`);
    console.log(`  Heading: ${v.heading}`);
    console.log(`  Image: ${v.image}`);
    console.log(`  Alt: ${v.alt}`);
  });
}
