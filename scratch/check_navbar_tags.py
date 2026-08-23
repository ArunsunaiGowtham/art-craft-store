import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'(<nav\s+class="navbar[\s\S]*?</nav>)', content, re.IGNORECASE)
    if match:
        nav_code = match.group(1)
        # Check tag balance
        ul_open = len(re.findall(r'<ul\b', nav_code, re.I))
        ul_close = len(re.findall(r'</ul>', nav_code, re.I))
        li_open = len(re.findall(r'<li\b', nav_code, re.I))
        li_close = len(re.findall(r'</li>', nav_code, re.I))
        print(f"[{filename}] UL: {ul_open} vs {ul_close} | LI: {li_open} vs {li_close}")
    else:
        print(f"[{filename}] NO NAVBAR")
