import re
from collections import defaultdict

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract products
p_match = re.search(r'products:\s*\[([\s\S]*?)\],\s*categories:', text)
prods = re.findall(r'id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"', p_match.group(1))

# Extract workshops
w_match = re.search(r'workshops:\s*\[([\s\S]*?)\],\s*blogPosts:', text)
workshops = re.findall(r'id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"', w_match.group(1))

# Extract brands
b_match = re.search(r'brands:\s*\[([\s\S]*?)\],\s*testimonials:', text)
brands = re.findall(r'id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"', b_match.group(1))

all_images = defaultdict(list)

for id_, name, img in prods:
    all_images[img].append(f"Product {id_}: {name}")

for id_, title, img in workshops:
    all_images[img].append(f"Workshop {id_}: {title}")

for id_, name, img in brands:
    all_images[img].append(f"Brand {id_}: {name}")

print("=== IMAGE CROSS-USAGE REPORT ===")
has_overlap = False
for img, items in all_images.items():
    if len(items) > 1:
        has_overlap = True
        print(f"\n[DUPLICATE URL across components]: {img}")
        for item in items:
            print(f"  - {item}")

if not has_overlap:
    print("Zero duplicates across all products, workshops, and brands!")
