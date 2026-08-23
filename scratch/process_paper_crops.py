import os
from PIL import Image

def get_crop(src, dst):
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
    ("scratch/flickr_sketch/cold_press_pad_3.jpg", "scratch/test_pad_3.jpg"),
    ("scratch/flickr_sketch/cold_press_pad_1.jpg", "scratch/test_pad_1.jpg"),
    ("scratch/arches_candidates/pad_tag_1.jpg", "scratch/test_tag_1.jpg"),
    ("scratch/arches_candidates/pad_tag_2.jpg", "scratch/test_tag_2.jpg"),
    ("scratch/watercolor_block.jpg", "scratch/test_wc_block.jpg"),
    ("scratch/cotton_paper.jpg", "scratch/test_cotton.jpg"),
    ("scratch/paper_pad_3.jpg", "scratch/test_paper_3.jpg")
]

for src, dst in candidates:
    if os.path.exists(src):
        get_crop(src, dst)
    else:
        print(f"Missing {src}")
