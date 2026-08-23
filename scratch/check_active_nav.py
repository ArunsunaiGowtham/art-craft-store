import glob
import re

files = glob.glob('*.html')
print(f"Checking navbar active link across {len(files)} HTML files:\n")

for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # find nav-active or class="...active..." in .navbar-nav
    nav_match = re.search(r'<ul class="navbar-nav">([\s\S]*?)</ul>', content)
    if not nav_match:
        print(f"{f:<25} -> No navbar-nav found")
        continue
        
    # Match all active links
    active_matches = re.findall(r'<a\s+[^>]*class="[^"]*\b(?:active|nav-active)\b[^"]*"[^>]*>([\s\S]*?)</a>', nav_match.group(1))
    clean_labels = [re.sub(r'<[^>]+>', '', m).strip() for m in active_matches]
    
    print(f"{f:<25} -> Active: {clean_labels}")
