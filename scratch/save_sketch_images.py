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

# 1. Product #6: Sketchbook Hardcover A4 (Black artist hardcover sketchbook)
save_crop_800x600("scratch/flickr_sketch/sketchbook_black_1.jpg", "images/product-sketchbook-hardcover-a4.jpg")

# 2. Product #36: 100% Cotton Cold Press Pad (300gsm) (Arches fine art watercolor block)
save_crop_800x600("scratch/flickr_sketch/arches_paper_5.jpg", "images/product-arches-watercolor-paper.jpg")
