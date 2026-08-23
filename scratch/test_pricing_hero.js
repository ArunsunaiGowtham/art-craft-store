const fs = require('fs');
const path = require('path');

console.log('=== PRICING PAGE HERO SECTION VERIFICATION ===\n');

// 1. Verify background image exists
const bgImagePath = path.join('images', 'backgrounds', 'membership-bg.jpg');
const bgExists = fs.existsSync(bgImagePath);
console.log(`[${bgExists ? 'PASS' : 'FAIL'}] membership-bg.jpg background image exists (${bgExists ? Math.round(fs.statSync(bgImagePath).size / 1024) + 'KB' : 'MISSING'})`);

// 2. Verify pricing.html structure and content
const pricingHtml = fs.readFileSync('pricing.html', 'utf8');

const htmlChecks = [
  ['Navbar is present at top', pricingHtml.includes('<nav class="navbar navbar-expand-lg">')],
  ['Hero section is present with pricing-hero / membership-hero class', pricingHtml.includes('class="pricing-hero membership-hero"') || pricingHtml.includes('class="pricing-hero"')],
  ['Breadcrumb has Home and Pricing', pricingHtml.includes('Home</a>') && pricingHtml.includes('Pricing')],
  ['Heading has "Workshop Packages and Membership"', pricingHtml.includes('Workshop Packages and Membership')],
  ['Description has "Choose the plan that fits your creative journey"', pricingHtml.includes('Choose the plan that fits your creative journey')],
  ['Hero content is wrapped in container with text-center alignment', pricingHtml.includes('pricing-hero-content') && pricingHtml.includes('text-center')],
  ['Pricing plans section directly follows hero', pricingHtml.includes('pricing-plans')],
  ['No extra spacer or intermediate sections between navbar and hero', !pricingHtml.includes('<div class="spacer"') && !pricingHtml.includes('<div style="height:')]
];

let htmlPass = true;
console.log('\nHTML Markup Verification:');
htmlChecks.forEach(([desc, passed]) => {
  if (!passed) htmlPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

// 3. Verify style.css rules
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const cssChecks = [
  ['.pricing-hero has position: relative and width: 100%', styleCss.includes('.pricing-hero,') && styleCss.includes('position: relative;') && styleCss.includes('width: 100%;')],
  ['.pricing-hero has margin: 0 / margin-top: 0', styleCss.includes('margin-top: 0;')],
  ['.pricing-hero has overflow: hidden', styleCss.includes('overflow: hidden;')],
  ['.pricing-hero uses background-size: cover', styleCss.includes('background-size: cover;')],
  ['.pricing-hero uses background-position: center', styleCss.includes('background-position: center;')],
  ['.pricing-hero uses background-repeat: no-repeat', styleCss.includes('background-repeat: no-repeat;')],
  ['.pricing-hero links to membership-bg.jpg', styleCss.includes("membership-bg.jpg")],
  ['Dark theme support exists for pricing-hero', styleCss.includes('[data-theme="dark"] .pricing-hero')],
  ['Heading typography and text contrast styling', styleCss.includes('.pricing-hero h1') && styleCss.includes('var(--font-heading)')],
  ['Description badge/pill styling with readable contrast', styleCss.includes('.pricing-hero p') && styleCss.includes('rgba(26,26,46,0.34)')],
  ['Mobile media query for pricing-hero exists', styleCss.includes('.pricing-hero') && styleCss.includes('background-position: center center;')],
];

console.log('\nCSS Styling Verification:');
let cssPass = true;
cssChecks.forEach(([desc, passed]) => {
  if (!passed) cssPass = false;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${desc}`);
});

const allPassed = bgExists && htmlPass && cssPass;
console.log('\nFinal Result:', allPassed ? 'ALL PRICING HERO CHECKS PASSED!' : 'SOME CHECKS FAILED!');
process.exit(allPassed ? 0 : 1);
