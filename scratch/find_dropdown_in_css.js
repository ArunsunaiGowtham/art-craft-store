const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('dropdown')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
