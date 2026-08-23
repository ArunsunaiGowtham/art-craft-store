import os
from PIL import Image, ImageStat

files = [
    ("pad_tag_1", "scratch/arches_candidates/pad_tag_1.jpg"),
    ("pad_tag_2", "scratch/arches_candidates/pad_tag_2.jpg"),
    ("arches_tag_1", "scratch/arches_candidates/arches_tag_1.jpg"),
    ("arches_tag_2", "scratch/arches_candidates/arches_tag_2.jpg"),
    ("arches_tag_3", "scratch/arches_candidates/arches_tag_3.jpg"),
    ("arches_tag_4", "scratch/arches_candidates/arches_tag_4.jpg"),
    ("arches_tag_5", "scratch/arches_candidates/arches_tag_5.jpg"),
    ("paper_tag_3", "scratch/arches_candidates/paper_tag_3.jpg"),
    ("cold_press_pad_1", "scratch/flickr_sketch/cold_press_pad_1.jpg"),
    ("cold_press_pad_3", "scratch/flickr_sketch/cold_press_pad_3.jpg"),
    ("watercolor_pad_1", "scratch/flickr_sketch/watercolor_pad_1.jpg"),
    ("cotton_paper", "scratch/cotton_paper.jpg"),
    ("watercolor_block", "scratch/watercolor_block.jpg"),
    ("paper_pad_3", "scratch/paper_pad_3.jpg")
]

for name, path in files:
    if os.path.exists(path):
        im = Image.open(path).convert('RGB')
        stat = ImageStat.Stat(im)
        print(f"[{name:20s}] Size: {im.size}, Bright: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}")
    else:
        print(f"[{name:20s}] MISSING")
