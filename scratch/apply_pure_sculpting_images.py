import os
from PIL import Image

def crop_800x600(src, dst):
    im = Image.open(src).convert('RGB')
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
    im.save(dst, "JPEG", quality=95)
    print(f"Saved {dst}: {im.size} ({os.path.getsize(dst)} bytes)")

# 1. Product #8: Modeling Clay Super Pack -> Colorful modeling clay blocks (mod_clay_7)
crop_800x600("scratch/crop_samples/mod_clay_7.jpg", "images/product-modeling-clay-pack.jpg")

# 2. Product #27: Air Dry Clay 10 Pack -> Pottery/sculpting clay on studio bench (air_pottery_5)
crop_800x600("scratch/crop_samples/air_pottery_5.jpg", "images/product-air-dry-clay-pack.jpg")

# 3. Product #35: Premo Polymer Clay 30-Color Multipack -> Polymer clay with conditioning & shaping tools
crop_800x600("scratch/wm_all_clay/Large_polymer_clay_conditioner.jpg", "images/product-sculpey-polymer-clay.jpg")
