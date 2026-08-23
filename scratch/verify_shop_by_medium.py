import re
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract Shop by Medium section
match = re.search(r'<!--\s*={4,}\s*SHOP BY MEDIUM\s*={4,}\s*-->([\s\S]*?)<!--\s*={4,}\s*FEATURED PRODUCTS', html)
assert match, "Could not find Shop by Medium section in index.html"
section_html = match.group(1)

cards = re.findall(r'<a\s+href="([^"]+)"\s+class="category-card">[\s\S]*?background-image:url\(\'([^\']+)\'\)[\s\S]*?<div class="category-name">([^<]+)</div>[\s\S]*?<div class="category-count">([^<]+)</div>', section_html)

print(f"Total Category Cards in Shop by Medium: {len(cards)}")
assert len(cards) == 8, f"Expected 8 cards, got {len(cards)}"

seen_images = {}
for href, img, name, count in cards:
    assert "placehold.co" not in img, f"Card '{name}' has placeholder image: {img}"
    assert img.startswith("https://images.unsplash.com/"), f"Card '{name}' invalid URL: {img}"
    assert img not in seen_images, f"Duplicate image in card '{name}': {img}"
    seen_images[img] = name
    
    req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req, timeout=5, context=ctx)
    assert res.status == 200, f"Card '{name}' image returned status {res.status}"
    
    print(f"[{res.status}] Category: {name:<22} | Link: {href:<28} | Count: {count:<15} -> OK")

print("\nAll 8 Shop by Medium category cards verified with 0 placeholders, 100% unique photography, and HTTP 200 OK!")
