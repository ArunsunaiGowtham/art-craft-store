import os
from PIL import Image, ImageEnhance

def process_product_image(src_path, dest_path, crop_box=None, brightness=1.0, contrast=1.0):
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
    if brightness != 1.0:
        im = ImageEnhance.Brightness(im).enhance(brightness)
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    
    im.save(dest_path, "JPEG", quality=92)
    print(f"Saved: {dest_path} -> {im.size} ({os.path.getsize(dest_path)} bytes)")

# 1. Product #6: Sketchbook Hardcover A4
# Let's test a clean, premium hardcover artist sketchbook
process_product_image("scratch/flickr_sketch/sketchbook_black_1.jpg", "scratch/test_sketchbook_1.jpg")
process_product_image("scratch/test_paper/sketchbook_hardcover_a4_2.jpg", "scratch/test_sketchbook_2.jpg")
process_product_image("scratch/flickr_sketch/sketchbook_hardcover_3.jpg", "scratch/test_sketchbook_3.jpg")

# 2. Product #36: 100% Cotton Cold Press Pad (300gsm) (Arches)
# Let's test high quality cold press watercolor / cotton paper blocks
process_product_image("scratch/flickr_sketch/arches_paper_5.jpg", "scratch/test_arches_1.jpg")
process_product_image("scratch/flickr_sketch/cold_press_pad_3.jpg", "scratch/test_arches_2.jpg")
process_product_image("scratch/flickr_sketch/arches_paper_1.jpg", "scratch/test_arches_3.jpg")
