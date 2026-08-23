import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Clean, lightweight mobile nav action bar: Cart + Hamburger Toggler
clean_mobile_actions = '''            <div class="mobile-nav-actions d-flex align-items-center gap-2 d-lg-none">
                <a href="cart.html" class="nav-icon-btn position-relative" aria-label="Cart">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="cart-badge cart-count" style="display:none">0</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
            </div>'''

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to replace existing mobile-nav-actions or raw navbar-toggler with clean_mobile_actions
    if 'class="mobile-nav-actions' in content:
        pattern = re.compile(r'<div\s+class="mobile-nav-actions[\s\S]*?</div>\s*(?=<div\s+class="collapse\s+navbar-collapse")', re.IGNORECASE)
        new_content, count = pattern.subn(clean_mobile_actions + '\n', content, count=1)
        if count > 0:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename} with 2-item mobile-nav-actions")
        else:
            print(f"Pattern failed on {filename}")
    elif '<nav class="navbar' in content and 'navbar-brand' in content:
        pattern = re.compile(r'(<a\s+class="navbar-brand"[^>]*>[\s\S]*?</a>\s*)(<button\s+class="navbar-toggler"[^>]*>[\s\S]*?</button>\s*)?(\s*<div\s+class="collapse\s+navbar-collapse")', re.IGNORECASE)
        def repl(m):
            brand = m.group(1).rstrip()
            collapse = m.group(3)
            return f"{brand}\n{clean_mobile_actions}\n{collapse}"
        new_content, count = pattern.subn(repl, content, count=1)
        if count > 0:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Inserted into {filename}")
