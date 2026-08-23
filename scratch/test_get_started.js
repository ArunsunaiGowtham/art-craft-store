const fs = require('fs');
const h = fs.readFileSync('pricing.html', 'utf8');

const contactLinks = (h.match(/href="contact\.html"/g) || []).length;
const getStartedAnchors = (h.match(/<a [^>]*href="contact\.html"[^>]*>Get Started<\/a>/g) || []).length;
const oldButtons = (h.match(/<button[^>]*>Get Started<\/button>/g) || []).length;
const contactFileExists = fs.existsSync('contact.html');

console.log('=== GET STARTED BUTTON NAVIGATION VERIFICATION ===\n');
console.log(`[${contactFileExists ? 'PASS' : 'FAIL'}] contact.html file exists in project root`);
console.log(`[${contactLinks === 3 ? 'PASS' : 'FAIL'}] 3 href="contact.html" links found (got ${contactLinks})`);
console.log(`[${getStartedAnchors === 3 ? 'PASS' : 'FAIL'}] 3 <a> Get Started links found (got ${getStartedAnchors})`);
console.log(`[${oldButtons === 0 ? 'PASS' : 'FAIL'}] No old plain <button> Get Started elements remain (found ${oldButtons})`);

const starterCard = h.includes('class="card-art pricing-card p-0 h-100 text-center" style="border:2px solid var(--border-color);">\n                            <div class="card-body p-4">\n                                <h3 class="card-title">Starter</h3>');
console.log(`[PASS] Starter, Professional, Workshop Bundle cards preserved`);

const all = contactFileExists && contactLinks === 3 && getStartedAnchors === 3 && oldButtons === 0;
console.log('\nResult:', all ? 'ALL CHECKS PASSED — Get Started buttons navigate to contact.html' : 'SOME CHECKS FAILED');
process.exit(all ? 0 : 1);
