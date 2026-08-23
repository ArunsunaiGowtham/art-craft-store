import json
import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Match product objects
# Each product has id, name, category, image, etc.
lines = content.split('\n')
current_product = {}
in_product = False
products = []

for line in lines:
    line_clean = line.strip()
    if line_clean.startswith('{') and 'id:' in line_clean:
        current_product = {}
        in_product = True
    elif line_clean.startswith('id:'):
        current_product = {}
        in_product = True
        current_product['id'] = int(re.search(r'id:\s*(\d+)', line_clean).group(1))
    
    if in_product:
        if 'id:' in line_clean and 'id' not in current_product:
            m = re.search(r'id:\s*(\d+)', line_clean)
            if m: current_product['id'] = int(m.group(1))
        if 'name:' in line_clean:
            m = re.search(r'name:\s*["\']([^"\']+)["\']', line_clean)
            if m: current_product['name'] = m.group(1)
        if 'category:' in line_clean:
            m = re.search(r'category:\s*["\']([^"\']+)["\']', line_clean)
            if m: current_product['category'] = m.group(1)
        if 'image:' in line_clean and 'image' not in current_product:
            m = re.search(r'image:\s*["\']([^"\']+)["\']', line_clean)
            if m: current_product['image'] = m.group(1)
        if 'images:' in line_clean:
            pass
        if line_clean == '},' or line_clean == '}':
            if 'category' in current_product and current_product.get('category') == 'sculpting':
                products.append(current_product)
            current_product = {}
            in_product = False

print(f"Total sculpting products found: {len(products)}")
for idx, p in enumerate(products, 1):
    print(f"[{idx}] ID: {p.get('id')}, Name: '{p.get('name')}', Image: '{p.get('image')}'")
