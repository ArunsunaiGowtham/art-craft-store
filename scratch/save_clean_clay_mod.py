from PIL import Image, ImageEnhance
import os

im = Image.open('scratch/unsplash_clay_test/clay_mod_1.jpg').convert('RGB')
w, h = im.size
target_ratio = 4/3
if w / h > target_ratio:
    new_w = int(h * target_ratio)
    offset = (w - new_w) // 2
    im = im.crop((offset, 0, offset + new_w, h))
else:
    new_h = int(w / target_ratio)
    offset = (h - new_h) // 2
    im = im.crop((0, offset, w, offset + new_h))

im = im.resize((800, 600), Image.LANCZOS)
dest = 'images/product-modeling-clay-pack.jpg'
im.save(dest, 'JPEG', quality=95)
print(f"Saved {dest}: {im.size} ({os.path.getsize(dest)} bytes)")
