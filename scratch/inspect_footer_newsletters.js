const fs = require('fs');

const htmlFiles = [
  'index.html', 'home-2.html', 'shop.html', 'product-details.html',
  'workshops.html', 'workshop-details.html', 'brands.html', 'about.html',
  'blog.html', 'blog-details.html', 'pricing.html', 'contact.html',
  'cart.html', 'checkout.html', 'login.html', 'register.html', 'student-supplies.html'
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const footerMatch = content.match(/<div class="footer-newsletter">([\s\S]*?)<\/div>/i);
  if (footerMatch) {
    console.log(`[${file}] -> ${footerMatch[0].replace(/\s+/g, ' ')}`);
  } else {
    console.log(`[${file}] -> NO footer-newsletter found`);
  }
});
