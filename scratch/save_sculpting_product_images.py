import os
from PIL import Image, ImageEnhance

def save_crop_800x600(src_path, dest_path, crop_rect=None):
    im = Image.open(src_path).convert('RGB')
    if crop_rect:
        im = im.crop(crop_rect)
    else:
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
    im.save(dest_path, "JPEG", quality=92)
    print(f"Saved {dest_path}: {im.size} ({os.path.getsize(dest_path)} bytes)")

# 1. Product 8: Modeling Clay Super Pack
save_crop_800x600("scratch/flickr_clay/modeling_clay_5.jpg", "images/product-modeling-clay-pack.jpg")

# 2. Product 27: Air Dry Clay 10 Pack
save_crop_800x600("scratch/flickr_clay/pottery_clay_5.jpg", "images/product-air-dry-clay-pack.jpg")

# 3. Product 35: Premo Polymer Clay 30-Color Multipack
save_crop_800x600("scratch/wm_all_clay/Polymer_clay_examples.jpg", "images/product-sculpey-polymer-clay.jpg")
