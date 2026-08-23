const fs = require('fs');

const css = fs.readFileSync('css/style.css', 'utf8');

// Find all width/margin/transform properties that could cause overflow on mobile
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('width:') && (line.includes('px') || line.includes('vw') || line.includes('%'))) {
    if (parseInt(line.split(':')[1]) > 320 && !line.includes('max-width') && !line.includes('container')) {
      // console.log(`Line ${idx+1}: ${line.trim()}`);
    }
  }
  if (line.includes('transform:') && line.includes('translate') && !line.includes('-50%')) {
    // console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});

// Check body and html overflow rules
console.log("HTML/Body overflow rules in CSS:");
lines.forEach((l, i) => {
  if (l.includes('overflow-x') || l.includes('overflow:')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
