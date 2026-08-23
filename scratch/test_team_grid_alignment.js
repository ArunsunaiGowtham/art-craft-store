const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');
const html = fs.readFileSync('about.html', 'utf8');

console.log("Validating Meet Our Team alignment rules:");

// Check key CSS rules
const checks = [
  { name: ".team-grid display: grid", test: css.includes("grid-template-columns: repeat(4, 1fr)") },
  { name: ".team-grid gap: 24px", test: css.includes("gap: 24px") },
  { name: ".team-card flex alignment", test: css.includes("align-items: center") },
  { name: ".team-card-avatar dimensions", test: css.includes("width: 120px") && css.includes("height: 120px") },
  { name: ".team-card-avatar circular", test: css.includes("border-radius: 50%") },
  { name: "Tablet breakpoint (2 cols)", test: css.includes("grid-template-columns: repeat(2, 1fr)") },
  { name: "Mobile breakpoint (1 col)", test: css.includes("grid-template-columns: 1fr") },
  { name: "about.html has .team-grid", test: html.includes('<div class="team-grid">') },
  { name: "about.html has 4 team cards", test: (html.match(/class="team-card"/g) || []).length === 4 }
];

let allPass = true;
checks.forEach(c => {
  console.log(`[${c.test ? 'PASS' : 'FAIL'}] ${c.name}`);
  if (!c.test) allPass = false;
});

if (allPass) {
  console.log("\nALL ALIGNMENT & RESPONSIVE RULES PASSED!");
} else {
  process.exit(1);
}
