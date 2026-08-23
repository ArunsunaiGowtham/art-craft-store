import re
import json

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'products:\s*\[([\s\S]*?)\],\s*categories:', text)
assert match, "Could not find products array"
prod_text = match.group(1)

items = re.findall(r'id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?categoryLabel:\s*"([^"]+)"', prod_text)

print(f"Total products found: {len(items)}")

categories_found = {}
for id_, name, cat, catLabel in items:
    if cat not in categories_found:
        categories_found[cat] = []
    categories_found[cat].append((id_, name, catLabel))

print("\nCategories in products:")
for cat, prods in sorted(categories_found.items()):
    print(f"  [{cat}] -> {len(prods)} products (e.g. {prods[0][1]})")

# Also check categories in data.js
match_cats = re.search(r'categories:\s*\[([\s\S]*?)\],\s*workshops:', text)
if match_cats:
    print("\nAppData.categories:")
    cats_data = re.findall(r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)"', match_cats.group(1))
    for cid, cname in cats_data:
        print(f"  id: {cid:<18} name: {cname}")
