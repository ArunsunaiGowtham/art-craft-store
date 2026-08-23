const fs = require('fs');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

const functionMatches = mainJs.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/g) || [];
console.log("Found functions:", functionMatches.map(f => f.replace('function ', '').replace('(', '').trim()));
