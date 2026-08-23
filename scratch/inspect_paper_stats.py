import os
from PIL import Image, ImageStat

files = [
    ("test_wc_block", "scratch/test_wc_block.jpg"),
    ("test_pad_3", "scratch/test_pad_3.jpg"),
    ("test_pad_1", "scratch/test_pad_1.jpg"),
    ("test_tag_1", "scratch/test_tag_1.jpg"),
    ("test_tag_2", "scratch/test_tag_2.jpg"),
    ("test_cotton", "scratch/test_cotton.jpg"),
    ("test_paper_3", "scratch/test_paper_3.jpg")
]

for name, path in files:
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{name:15s}] Brightness: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}, Mean RGB: {[round(x,1) for x in stat.mean]}")
