from PIL import Image, ImageStat
import os

for name in ['clay_mod_1', 'studio_sculpt', 'clay_hand_1', 'art_materials', 'palette_clay']:
    p = f"scratch/unsplash_clay_test/{name}.jpg"
    im = Image.open(p).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{name:15s}] size: {im.size}, brightness: {sum(stat.mean)/3:.1f}, contrast: {sum(stat.stddev)/3:.1f}, RGB: {stat.mean}")
