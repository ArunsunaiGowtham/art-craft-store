import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

single_toggler = '''            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>'''

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<nav class="navbar' in content and 'navbar-brand' in content:
        # Match mobile-nav-actions block or any toggler block between navbar-brand and collapse navbar-collapse
        pattern = re.compile(r'(<a\s+[^>]*class="[^"]*navbar-brand[^"]*"[^>]*>[\s\S]*?</a>\s*)(?:<div\s+class="mobile-nav-actions[\s\S]*?</div>|<button\s+class="navbar-toggler"[\s\S]*?</button>)?(\s*<div\s+class="collapse\s+navbar-collapse")', re.IGNORECASE)
        
        def repl(m):
            brand = m.group(1).rstrip()
            collapse = m.group(2)
            return f"{brand}\n{single_toggler}\n{collapse}"

        new_content, count = pattern.subn(repl, content, count=1)
        if count > 0:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned navbar in {filename}")
        else:
            print(f"Pattern failed on {filename}")
