import os, glob, re

html_files = glob.glob("*.html")
print(f"Checking {len(html_files)} HTML files...\n")

for f in sorted(html_files):
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    footer_match = re.search(r'<footer[\s\S]*?</footer>', content)
    if not footer_match:
        print(f"[{f}] NO FOOTER FOUND")
        continue
    
    footer_code = footer_match.group(0)
    has_artcraft = "ArtCraft" in footer_code
    has_shop = "<h5>Shop</h5>" in footer_code or "<h4>Shop</h4>" in footer_code
    has_quick = "<h5>Quick Links</h5>" in footer_code or "<h4>Quick Links</h4>" in footer_code
    has_news = "<h5>Newsletter</h5>" in footer_code or "<h4>Newsletter</h4>" in footer_code
    has_bottom = "footer-bottom" in footer_code
    has_grid = "footer-grid" in footer_code
    has_scroll_top = "scroll-top" in content
    
    cols = [has_artcraft, has_shop, has_quick, has_news]
    num_cols = sum(1 for c in cols if c)
    print(f"[{f}] Cols: {num_cols}/4 (ArtCraft:{has_artcraft}, Shop:{has_shop}, Quick:{has_quick}, News:{has_news}) | Grid:{has_grid} | Bottom:{has_bottom} | ScrollTop:{has_scroll_top}")
