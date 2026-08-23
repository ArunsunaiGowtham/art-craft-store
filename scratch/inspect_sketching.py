import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
current = {}
products = []
in_prod = False

for line in lines:
    l = line.strip()
    if 'id:' in l and '{' in l:
        current = {}
        in_prod = True
    elif l.startswith('id:'):
        current = {}
        in_prod = True
        m = re.search(r'id:\s*(\d+)', l)
        if m: current['id'] = int(m.group(1))
    if in_prod:
        if 'id:' in l and 'id' not in current:
            m = re.search(r'id:\s*(\d+)', l)
            if m: current['id'] = int(m.group(1))
        if 'name:' in l:
            m = re.search(r'name:\s*["\']([^"\']+)["\']', l)
            if m: current['name'] = m.group(1)
        if 'category:' in l:
            m = re.search(r'category:\s*["\']([^"\']+)["\']', l)
            if m: current['category'] = m.group(1)
        if 'image:' in l and 'image' not in current:
            m = re.search(r'image:\s*["\']([^"\']+)["\']', l)
            if m: current['image'] = m.group(1)
        if 'badge:' in l:
            m = re.search(r'badge:\s*["\']([^"\']+)["\']', l)
            if m: current['badge'] = m.group(1)
        if l in ['},', '}']:
            if current.get('category') == 'sketching':
                products.append(current)
            in_prod = False
            current = {}

print(f"Total sketching products: {len(products)}")
for idx, p in enumerate(products, 1):
    print(f"[{idx}] ID: {p.get('id')}, Name: '{p.get('name')}', Badge: {p.get('badge')}, Image: '{p.get('image')}'")
