import os, re

with open('shop.html', 'r', encoding='utf-8') as f:
    shop_html = f.read()

with open('css/style.css', 'r', encoding='utf-8') as f:
    style_css = f.read()

checks = []

# 1. Check shop.html semantic structure
checks.append(('shop.html has <section class="shop-hero">', '<section class="shop-hero">' in shop_html))
checks.append(('shop.html has breadcrumb inside container', '<nav class="breadcrumb-art"' in shop_html))
checks.append(('shop.html has shop-hero-content', 'class="shop-hero-content' in shop_html))
checks.append(('shop.html has title "Our Collection"', 'Our Collection' in shop_html))
checks.append(('shop.html has subtitle', 'Discover premium art supplies for every medium and skill level' in shop_html))
checks.append(('shop.html has <section class="shop-products-section section">', '<section class="shop-products-section section">' in shop_html))
checks.append(('shop.html has filter-sidebar', 'class="filter-sidebar"' in shop_html))
checks.append(('shop.html has product search input', 'id="product-search"' in shop_html))
checks.append(('shop.html has categories filter', 'data-category="all"' in shop_html))
checks.append(('shop.html has products-container', 'id="products-container"' in shop_html))

# 2. Check style.css rules
checks.append(('style.css has .shop-hero base rule', '.shop-hero {' in style_css))
checks.append(('style.css .shop-hero has background-image', "url('../images/backgrounds/shop-bg.jpg')" in style_css))
checks.append(('style.css .shop-hero has overflow: hidden', 'overflow: hidden;' in style_css))
checks.append(('style.css has .shop-hero .breadcrumb-art', '.shop-hero .breadcrumb-art' in style_css))
checks.append(('style.css has .shop-hero-content', '.shop-hero-content {' in style_css))
checks.append(('style.css has .shop-hero-content .section-title', '.shop-hero-content .section-title' in style_css))
checks.append(('style.css has .shop-hero-content .section-subtitle', '.shop-hero-content .section-subtitle' in style_css))
checks.append(('style.css has .shop-products-section', '.shop-products-section {' in style_css))
checks.append(('style.css .shop-products-section has margin-top: 0', 'margin-top: 0;' in style_css))
checks.append(('style.css has mobile responsive rules for .shop-hero', '@media (max-width: 767.98px)' in style_css and '.shop-products-section' in style_css))

# 3. Check for any negative margins or absolute positioning conflicts on shop sections
checks.append(('No negative margin on shop-products-section', not bool(re.search(r'\.shop-products-section\s*\{[^}]*margin-top:\s*-\d+', style_css))))
checks.append(('No absolute positioning on shop-products-section', not bool(re.search(r'\.shop-products-section\s*\{[^}]*position:\s*absolute', style_css))))

print("=== SHOP PAGE LAYOUT & CSS VERIFICATION ===")
all_pass = True
for name, passed in checks:
    status = "PASS" if passed else "FAIL"
    if not passed:
        all_pass = False
    print(f"[{status}] {name}")

print("\nResult:", "ALL CHECKS PASSED!" if all_pass else "SOME CHECKS FAILED!")
