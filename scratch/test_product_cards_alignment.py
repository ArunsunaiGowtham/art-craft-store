import re
import sys

# Test 1: Check style.css rules
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

assert '.product-card' in css, "Missing .product-card"
assert 'display: flex' in css, "Missing flex display on product-card"
assert 'flex-direction: column' in css, "Missing flex-direction on product-card"
assert 'height: 100%' in css, "Missing height 100% on product-card"
assert 'object-fit: cover' in css, "Missing object-fit: cover"
assert '-webkit-line-clamp: 2' in css, "Missing line-clamp: 2 on card title"
assert 'height: 2.7em' in css, "Missing fixed 2.7em height on card title"
assert 'margin-top: auto' in css, "Missing margin-top: auto on price section"
assert 'border-radius: var(--radius-sm, 8px)' in css or 'border-radius:' in css, "Missing border radius on button"

# Test 2: Check index.html product cards
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

cols = re.findall(r'<div class="col-[^"]*">\s*<div class="product-card', index_html)
assert len(cols) == 8, f"Expected 8 product cards in index.html, found {len(cols)}"
for col in cols:
    assert 'col-12 col-sm-6 col-lg-3' in col, f"Column class mismatch in index.html: {col}"

# Test 3: Check home-2.html product cards
with open('home-2.html', 'r', encoding='utf-8') as f:
    home_html = f.read()

home_cols = re.findall(r'<div class="col-[^"]*">\s*<div class="product-card', home_html)
assert len(home_cols) == 4, f"Expected 4 product cards in home-2.html, found {len(home_cols)}"
for col in home_cols:
    assert 'col-12 col-sm-6 col-lg-3' in col, f"Column class mismatch in home-2.html: {col}"

# Test 4: Check student-supplies.html
with open('student-supplies.html', 'r', encoding='utf-8') as f:
    student_html = f.read()
assert 'col-12 col-sm-6 col-lg-3' in student_html, "student-supplies.html missing responsive column classes"

# Test 5: Check product-details.html
with open('product-details.html', 'r', encoding='utf-8') as f:
    pd_html = f.read()
assert 'col-12 col-sm-6 col-lg-3' in pd_html, "product-details.html missing responsive column classes"

print("All product card alignment and responsiveness tests passed successfully!")
