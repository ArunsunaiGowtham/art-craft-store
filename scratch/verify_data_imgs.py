import os
import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

imgs = re.findall(r'image:\s*["\']([^"\']+)["\']', text)
print(f"Total product images in data.js: {len(imgs)}")
for img in imgs:
    if img.startswith('images/'):
        exists = os.path.exists(img)
        status = "OK" if exists else "MISSING"
        print(f"  {status}: {img}")
    else:
        print(f"  EXTERNAL: {img[:70]}")
