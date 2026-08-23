import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

mobile_actions_html = '''            <div class="mobile-nav-actions d-flex align-items-center gap-2 d-lg-none">
                <button class="nav-icon-btn theme-toggle" aria-label="Toggle theme"><i class="fas fa-moon"></i></button>
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

    # Check if file has navbar-brand and navbar-collapse
    if '<nav class="navbar' in content and 'navbar-brand' in content and 'navbar-collapse' in content:
        # Check if already has mobile-nav-actions
        if 'mobile-nav-actions' not in content:
            # Pattern matching from after navbar-brand until <div class="collapse navbar-collapse"
            pattern = re.compile(r'(<a\s+class="navbar-brand"[^>]*>[\s\S]*?</a>\s*)(<button\s+class="navbar-toggler"[^>]*>[\s\S]*?</button>\s*)?(\s*<div\s+class="collapse\s+navbar-collapse")', re.IGNORECASE)
            
            def repl(m):
                brand = m.group(1).rstrip()
                collapse = m.group(3)
                return f"{brand}\n{mobile_actions_html}\n{collapse}"
            
            new_content, count = pattern.subn(repl, content, count=1)
            if count > 0:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename} with mobile-nav-actions!")
            else:
                print(f"Could not match pattern in {filename}")
        else:
            print(f"{filename} already has mobile-nav-actions")
