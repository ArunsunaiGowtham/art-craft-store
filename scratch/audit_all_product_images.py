import re
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'products:\s*\[([\s\S]*?)\],\s*categories:', text)
assert match, "Could not find products array"
prod_text = match.group(1)

items = re.findall(r'id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"', prod_text)

print(f"Total products found: {len(items)}\n")

seen_images = {}
for id_, name, cat, img in items:
    is_dup = img in seen_images
    if is_dup:
        prev_id, prev_name = seen_images[img]
        dup_str = f"DUPLICATE of ID {prev_id} ({prev_name})"
    else:
        dup_str = "UNIQUE"
        seen_images[img] = (id_, name)
        
    print(f"ID {id_:>2}: {name:<35} | Cat: {cat:<16} | {dup_str}")
    print(f"       URL: {img}")
