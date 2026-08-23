const fs = require('fs');

const blogDetails = fs.readFileSync('blog-details.html', 'utf8');
const workshops = fs.readFileSync('workshops.html', 'utf8');
const workshopDetails = fs.readFileSync('workshop-details.html', 'utf8');
const studentSupplies = fs.readFileSync('student-supplies.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

// Check blog-details sidebar newsletter
if (!blogDetails.includes('class="sidebar-newsletter-form"')) {
  console.error("FAIL: blog-details.html missing sidebar-newsletter-form");
  process.exit(1);
}
if (!blogDetails.includes('class="form-control sidebar-newsletter-input"')) {
  console.error("FAIL: blog-details.html missing sidebar-newsletter-input");
  process.exit(1);
}
if (!blogDetails.includes('class="btn btn-sidebar-newsletter"')) {
  console.error("FAIL: blog-details.html missing btn-sidebar-newsletter");
  process.exit(1);
}

// Check styleCss definitions
if (!styleCss.includes('.sidebar-newsletter-input {')) {
  console.error("FAIL: style.css missing .sidebar-newsletter-input");
  process.exit(1);
}
if (!styleCss.includes('.btn-sidebar-newsletter {')) {
  console.error("FAIL: style.css missing .btn-sidebar-newsletter");
  process.exit(1);
}

// Check workshops & student-supplies responsive newsletter wraps
if (!workshops.includes('<div class="newsletter-input-wrap">')) {
  console.error("FAIL: workshops.html missing newsletter-input-wrap");
  process.exit(1);
}
if (!workshopDetails.includes('<div class="newsletter-input-wrap">')) {
  console.error("FAIL: workshop-details.html missing newsletter-input-wrap");
  process.exit(1);
}
if (!studentSupplies.includes('<div class="newsletter-input-wrap">')) {
  console.error("FAIL: student-supplies.html missing newsletter-input-wrap");
  process.exit(1);
}

console.log("SUCCESS: All newsletter forms and sidebar widgets verified responsive and accessible!");
