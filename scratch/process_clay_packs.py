import os
from PIL import Image

def process_product_image(src, dst):
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
    im.save(dst, "JPEG", quality=92)
    print(f"Saved {dst}: {im.size} ({os.path.getsize(dst)} bytes)")

candidates = [
    # Modeling clay (Product #8)
    ("scratch/clay_products_flickr/mod_colors_2.jpg", "scratch/test_prod_mod_2.jpg"),
    ("scratch/clay_products_flickr/mod_colors_5.jpg", "scratch/test_prod_mod_5.jpg"),
    ("scratch/clay_products_flickr/plasticine_pack_3.jpg", "scratch/test_prod_plast_3.jpg"),
    
    # Air Dry Clay (Product #27)
    ("scratch/clay_products_flickr/air_dry_pack_1.jpg", "scratch/test_prod_air_1.jpg"),
    ("scratch/clay_products_new/Block_of_mixed_earthenware_clay.JPG", "scratch/test_prod_earthen.jpg"),
    
    # Polymer Clay / Sculpey Premo (Product #35)
    ("scratch/clay_products_flickr/sculpey_pack_5.jpg", "scratch/test_prod_sculpey_5.jpg"),
    ("scratch/clay_products_flickr/sculpey_pack_4.jpg", "scratch/test_prod_sculpey_4.jpg"),
    ("scratch/clay_products_flickr/fimo_blocks_5.jpg", "scratch/test_prod_fimo_5.jpg"),
    ("scratch/clay_products_flickr/polymer_pack_1.jpg", "scratch/test_prod_poly_1.jpg")
]

for src, dst in candidates:
    if os.path.exists(src):
        process_product_image(src, dst)
    else:
        print(f"Missing {src}")
