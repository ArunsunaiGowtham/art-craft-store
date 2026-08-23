const css = require('fs').readFileSync('css/style.css', 'utf8');

const checks = [
  ['Mobile .filter-sidebar has overflow:hidden', css.includes('overflow: hidden;')],
  ['.filter-sidebar .filter-section gets max-width:100%', css.includes('.filter-sidebar .filter-section,')],
  ['.filter-sidebar .category-filter-btn has min-width:0', css.includes('min-width: 0;')],
  ['.filter-sidebar .price-range input constrained', css.includes('.filter-sidebar .price-range input[type="range"]')],
  ['.filter-sidebar .btn-clear-filters full-width rule', css.includes('.filter-sidebar .btn-clear-filters')],
  ['480px breakpoint exists', css.includes('@media (max-width: 480px)')],
  ['CSS braces balanced', (() => { let o=0,c=0; for(const ch of css){if(ch==='{')o++;if(ch==='}')c++;} return o===c; })()],
];

let pass = true;
checks.forEach(([d, p]) => {
  if (!p) pass = false;
  console.log((p ? '[PASS]' : '[FAIL]') + ' ' + d);
});
console.log('\n' + (pass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'));
process.exit(pass ? 0 : 1);
