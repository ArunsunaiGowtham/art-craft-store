import os
from PIL import Image

def create_crop_800x600(src_path, dest_path, crop_box=None):
    im = Image.open(src_path).convert('RGB')
    if crop_box:
        im = im.crop(crop_box)
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
    im.save(dest_path, "JPEG", quality=95)
    print(f"Saved {dest_path}: {im.size} ({os.path.getsize(dest_path)} bytes)")

# 1. Product #8: Modeling Clay Super Pack -> FIMO colorful clay blocks in neat rows
create_crop_800x600("scratch/clay_products_flickr/fimo_blocks_5.jpg", "images/product-modeling-clay-pack.jpg")

# 2. Product #27: Air Dry Clay 10 Pack -> Block of mixed earthenware clay / pottery sculpting block
create_crop_800x600("scratch/clay_products_new/Block_of_mixed_earthenware_clay.JPG", "images/product-air-dry-clay-pack.jpg")

# 3. Product #35: Premo Polymer Clay 30-Color Multipack -> Polymer clay colorful bars and blocks
create_crop_800x600("scratch/wm_all_clay/Polymer_clay_examples.jpg", "images/product-sculpey-polymer-clay.jpg")
