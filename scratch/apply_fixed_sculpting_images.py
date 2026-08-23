import os
from PIL import Image

def crop_and_save_4x3(src_path, dest_path, crop_box=None):
    im = Image.open(src_path).convert('RGB')
    if crop_box:
        im = im.crop(crop_box)
    else:
        w, h = im.size
        target_ratio = 4.0 / 3.0
        if w / h > target_ratio:
            new_w = int(h * target_ratio)
            offset = (w - new_w) // 2
            im = im.crop((offset, 0, offset + new_w, h))
        else:
            new_h = int(w / target_ratio)
            offset = (h - new_h) // 2
            im = im.crop((0, offset, w, offset + new_h))
    
    im = im.resize((800, 600), Image.LANCZOS)
    im.save(dest_path, "JPEG", quality=95)
    print(f"Saved {dest_path}: {im.size} ({os.path.getsize(dest_path)} bytes)")

# 1. Product #8: Modeling Clay Super Pack (36-color air-dry clay kit)
crop_and_save_4x3("scratch/audit/p_8_sculpting.jpg", "images/product-modeling-clay-pack.jpg")

# 2. Product #27: Air Dry Clay 10 Pack (10-pack of air dry clay)
crop_and_save_4x3("scratch/audit/p_27_sculpting.jpg", "images/product-air-dry-clay-pack.jpg")

# 3. Product #35: Premo Polymer Clay 30-Color Multipack (Polymer clay blocks)
crop_and_save_4x3("scratch/audit/p_35_sculpting.jpg", "images/product-sculpey-polymer-clay.jpg")
