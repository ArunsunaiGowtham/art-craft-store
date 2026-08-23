import os
from PIL import Image, ImageStat

def inspect(path):
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"Path: {path}")
    print(f"  Size: {im.size}, Brightness: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}")

print("=== 1. Modeling Clay ===")
inspect("scratch/flickr_clay/modeling_clay_2.jpg")
inspect("scratch/test_curated/modeling_clay_unsplash_1.jpg")

print("\n=== 2. Air Dry Clay ===")
inspect("scratch/flickr_clay/pottery_clay_5.jpg")
inspect("scratch/crop_samples/air_pottery_5.jpg")

print("\n=== 3. Polymer Clay ===")
inspect("scratch/wm_all_clay/Polymer_clay_examples.jpg")
inspect("scratch/wm_all_clay/Large_polymer_clay_conditioner.jpg")
