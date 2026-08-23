const fs = require('fs');

const files = fs.readdirSync('images');
console.log(`Total files in images/: ${files.length}`);
files.sort().forEach(f => {
  const stat = fs.statSync(`images/${f}`);
  console.log(`  - ${f} (${stat.size} bytes)`);
});
