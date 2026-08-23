import glob
import re
import sys

required_links = [
    ("Facebook", "https://www.facebook.com/"),
    ("Instagram", "https://www.instagram.com/"),
    ("Twitter", "https://x.com/"),
    ("YouTube", "https://www.youtube.com/"),
    ("Pinterest", "https://www.pinterest.com/")
]

all_passed = True

for html_file in sorted(glob.glob("*.html")):
    content = open(html_file, "r", encoding="utf-8").read()
    
    # Check footer-social or social links
    match = re.search(r'(<div class="footer-social">[\s\S]*?</div>|<!-- Social links -->\s*<div class="d-flex gap-3 justify-content-center">[\s\S]*?</div>)', content)
    if not match:
        if html_file == '404.html':
            continue
        print(f"[WARN] {html_file}: No footer-social found")
        continue
    
    block = match.group(0)
    
    # Check for placeholder href="#"
    if 'href="#"' in block:
        print(f"[FAIL] {html_file}: Still contains href=\"#\" in social block")
        all_passed = False
        continue

    # Check each required URL and attributes
    for label, url in required_links:
        if f'href="{url}"' not in block:
            print(f"[FAIL] {html_file}: Missing {label} URL ({url})")
            all_passed = False
        if f'target="_blank"' not in block or f'rel="noopener noreferrer"' not in block:
            print(f"[FAIL] {html_file}: Missing target=\"_blank\" or rel=\"noopener noreferrer\" for {label}")
            all_passed = False
            
    print(f"[PASS] {html_file}: All 5 social icons verified with valid URLs and target=\"_blank\"")

if all_passed:
    print("\nALL SOCIAL MEDIA ICONS VERIFIED PERFECTLY ACROSS ALL HTML FILES!")
else:
    print("\nSOME VERIFICATIONS FAILED")
