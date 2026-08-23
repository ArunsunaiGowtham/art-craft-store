import glob
import re

for html_file in sorted(glob.glob('*.html')):
    content = open(html_file, 'r', encoding='utf-8').read()
    match = re.search(r'<div class="footer-social">([\s\S]*?)</div>', content)
    if match:
        print(f"=== {html_file} ===")
        print(match.group(0).strip())
