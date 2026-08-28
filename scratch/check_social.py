import glob
import re

files = sorted(glob.glob('*.html'))
print("=== All HTML Files Checked ===")
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    tags = re.findall(r'<a\b[^>]*>[\s\S]*?</a>', content)
    matched = []
    for tag in tags:
        if any(term in tag.lower() for term in ['fa-instagram', 'fa-twitter', 'fa-facebook', 'fa-youtube', 'fa-pinterest', 'fa-linkedin', 'fa-x-twitter', 'aria-label="instagram"', 'aria-label="twitter"', 'aria-label="facebook"', 'aria-label="youtube"', 'aria-label="pinterest"', 'aria-label="linkedin"']):
            matched.append(re.sub(r'\s+', ' ', tag.strip()))
    
    if matched:
        print(f"\n{f}:")
        for m in matched:
            print(f"  {m}")
