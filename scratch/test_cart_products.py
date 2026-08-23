import re
import json

with open('js/data.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

# Extract products array
match = re.search(r'products:\s*(\[[\s\S]*?\]),\s*workshops:', js_text)
if not match:
    print("Failed to find products array in js/data.js")
    exit(1)

products_raw = match.group(1)
# Clean JS keys to make it valid JSON
products_clean = re.sub(r'(\w+):', r'"\1":', products_raw)
products_clean = re.sub(r',\s*\]', ']', products_clean)
products_clean = re.sub(r',\s*\}', '}', products_clean)

products = json.loads(products_clean)
print(f"Total products in AppData: {len(products)}\n")

categories = set()
for p in products:
    categories.add(p['category'])
    print(f"ID {p['id']:<2}: {p['name']:<35} | ${p['price']:<6} | Cat: {p['category']:<15} | Img: {p['image'][:35]}...")

print(f"\nTotal categories: {len(categories)}")
print("Categories:", sorted(list(categories)))
