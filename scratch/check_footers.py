import glob
import re

files = glob.glob('*.html')
print(f"Inspecting footer markup across {len(files)} HTML files:\n")

for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()

    has_footer = '<footer class="footer">' in content or '<footer class="footer' in content
    if not has_footer:
        print(f"{f:<25} -> No footer element found")
        continue

    # Extract footer
    match = re.search(r'<footer class="footer[^"]*">([\s\S]*?)</footer>', content)
    if not match:
        print(f"{f:<25} -> Footer tag unclosed or mismatched")
        continue

    footer_content = match.group(1)
    has_grid = 'footer-grid' in footer_content
    has_bottom = 'footer-bottom' in footer_content
    has_social = 'footer-social' in footer_content
    has_newsletter = 'footer-newsletter' in footer_content

    print(f"{f:<25} -> grid:{has_grid} | bottom:{has_bottom} | social:{has_social} | nl:{has_newsletter}")
