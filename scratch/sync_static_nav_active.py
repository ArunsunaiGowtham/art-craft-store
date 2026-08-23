import glob
import re

page_map = {
    'index.html': ('home', 'index.html'),
    'home-2.html': ('home', 'home-2.html'),
    'shop.html': ('shop.html', None),
    'workshops.html': ('workshops.html', None),
    'brands.html': ('brands.html', None),
    'about.html': ('about.html', None),
    'blog.html': ('blog.html', None),
    'contact.html': ('contact.html', None),
    'cart.html': (None, None),
    'checkout.html': (None, None),
    'login.html': (None, None),
    'register.html': (None, None),
    'pricing.html': (None, None),
    'student-supplies.html': (None, None),
    'product-details.html': (None, None),
    'workshop-details.html': (None, None),
    'blog-details.html': (None, None)
}

for page, (target, sub_target) in page_map.items():
    try:
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        continue

    # Extract navbar-nav
    nav_match = re.search(r'(<ul class="navbar-nav">)([\s\S]*?)(</ul>)', content)
    if not nav_match:
        continue

    nav_body = nav_match.group(2)
    
    # Clean existing active/nav-active classes inside navbar-nav
    nav_body = re.sub(r'\b(active|nav-active)\b', '', nav_body)
    nav_body = re.sub(r'class="\s*"', '', nav_body)
    nav_body = re.sub(r'class="\s+([^"]+)"', r'class="\1"', nav_body)
    nav_body = re.sub(r'class="([^"]+)\s+"', r'class="\1"', nav_body)

    if target == 'home':
        # activate dropdown toggle and sub_target
        nav_body = re.sub(r'(<a\s+class="nav-link dropdown-toggle)', r'\1 active', nav_body)
        nav_body = re.sub(rf'(<a\s+class="dropdown-item"\s+href="{sub_target}")', r'\1 active', nav_body)
    elif target:
        # activate specific nav-link
        pattern = rf'(<a\s+class="nav-link"\s+href="{target}")'
        nav_body = re.sub(pattern, rf'<a class="nav-link active" href="{target}"', nav_body)

    new_content = content[:nav_match.start(2)] + nav_body + content[nav_match.end(2):]
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Updated {page:<25} -> Active: {target or 'None'}")

print("\nAll HTML files synced!")
