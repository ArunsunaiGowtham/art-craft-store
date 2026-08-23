import os
from PIL import Image, ImageEnhance, ImageFilter

def process_product_image(src_path, dest_path, crop_box=None, brightness=1.0, contrast=1.0):
    im = Image.open(src_path).convert('RGB')
    if crop_box:
        im = im.crop(crop_box)
    else:
        # Default center crop to 4:3
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
    if brightness != 1.0:
        im = ImageEnhance.Brightness(im).enhance(brightness)
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    
    im.save(dest_path, "JPEG", quality=92)
    print(f"Saved: {dest_path} -> {im.size} ({os.path.getsize(dest_path)} bytes)")

print("=== Testing Polymer Clay (Polymer_clay_examples.jpg) ===")
# Polymer_clay_examples.jpg is (3033, 1911) of colorful polymer clay bars/blocks
process_product_image("scratch/wm_all_clay/Polymer_clay_examples.jpg", "scratch/poly_test1.jpg")

print("\n=== Testing Modeling Clay (modeling_clay_5.jpg / modeling_clay_unsplash_1.jpg) ===")
process_product_image("scratch/flickr_clay/modeling_clay_5.jpg", "scratch/mod_test1.jpg")
process_product_image("scratch/test_curated/modeling_clay_unsplash_1.jpg", "scratch/mod_test2.jpg")
process_product_image("scratch/wm_all_clay/Fimo_blocks.png", "scratch/mod_test3.jpg")

print("\n=== Testing Air Dry Clay (pottery_clay_5.jpg / airdry_clay_unsplash_4.jpg / air_clay_12.jpg) ===")
process_product_image("scratch/flickr_clay/pottery_clay_5.jpg", "scratch/air_test1.jpg")
process_product_image("scratch/test_curated/airdry_clay_unsplash_4.jpg", "scratch/air_test2.jpg")
process_product_image("scratch/clay_12.jpg", "scratch/air_test3.jpg")
