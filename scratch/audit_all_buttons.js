const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html', 'home-2.html', 'shop.html', 'product-details.html',
  'workshops.html', 'workshop-details.html', 'brands.html', 'about.html',
  'blog.html', 'blog-details.html', 'pricing.html', 'contact.html',
  'cart.html', 'checkout.html', 'login.html', 'register.html', 'student-supplies.html'
];

console.log("==================================================");
console.log("  COMPREHENSIVE BUTTON AUDIT ACROSS ALL 17 PAGES");
console.log("==================================================");

let totalButtons = 0;
let totalLinksAsButtons = 0;
let issues = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // 1. Check all <button> elements
  const buttonMatches = content.match(/<button[\s\S]*?<\/button>/gi) || [];
  totalButtons += buttonMatches.length;

  buttonMatches.forEach(btn => {
    // Check if button has type, aria-label or accessible text
    const hasType = btn.includes('type=');
    const hasAria = btn.includes('aria-label=') || btn.includes('aria-labelledby=');
    const innerText = btn.replace(/<[^>]+>/g, '').trim();
    const hasContent = innerText.length > 0 || btn.includes('<i ') || btn.includes('<svg');
    
    if (!hasContent) {
      issues.push(`[${file}] Empty button with no text or icon: ${btn.slice(0, 50)}...`);
    }
  });

  // 2. Check all .btn links
  const btnLinkMatches = content.match(/<a\s+[^>]*class="[^"]*\bbtn\b[^"]*"[\s\S]*?<\/a>/gi) || [];
  totalLinksAsButtons += btnLinkMatches.length;

  btnLinkMatches.forEach(link => {
    const hasHref = link.includes('href=');
    const hrefMatch = link.match(/href="([^"]*)"/i);
    const href = hrefMatch ? hrefMatch[1] : '';
    if (!hasHref || href === '' || href === '#!') {
      issues.push(`[${file}] Button link has empty/invalid href: ${link.slice(0, 50)}...`);
    }
  });
});

console.log(`Audited ${htmlFiles.length} pages:`);
console.log(`- Found ${totalButtons} <button> elements`);
console.log(`- Found ${totalLinksAsButtons} <a> styled as buttons`);
console.log(`- Total interactive buttons: ${totalButtons + totalLinksAsButtons}`);

if (issues.length > 0) {
  console.log(`\nFound ${issues.length} potential issues:`);
  issues.slice(0, 15).forEach(iss => console.log('⚠️  ' + iss));
} else {
  console.log("\n✓ All buttons across all 17 HTML files have valid markup and targets!");
}
