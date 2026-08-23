import os
from PIL import Image, ImageStat

files = [
    ("mod_clay_9", "scratch/crop_samples/mod_clay_9.jpg"),
    ("mod_clay_7", "scratch/crop_samples/mod_clay_7.jpg"),
    ("air_pottery_2", "scratch/crop_samples/air_pottery_2.jpg"),
    ("air_pottery_5", "scratch/crop_samples/air_pottery_5.jpg")
]

for name, path in files:
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{name}] Size: {im.size}, Brightness: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}, RGB: {stat.mean}")
