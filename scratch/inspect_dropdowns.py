import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the dropdown li in navbar
    match = re.search(r'(<li\s+class="dropdown">[\s\S]*?</li>)', content, re.IGNORECASE)
    if match:
        li_block = match.group(1)
        print(f"[{filename}] -> {li_block.strip()[:80]}...")
    else:
        print(f"[{filename}] -> NO dropdown li found")
