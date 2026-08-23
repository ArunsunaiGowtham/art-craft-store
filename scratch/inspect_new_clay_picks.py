from PIL import Image, ImageStat
import os

for f in ['flickr_plasticine.jpg', 'flickr_plastilin.jpg', 'clay_bars_3.jpg']:
    p = os.path.join('scratch/new_modeling_clay', f)
    im = Image.open(p).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{f}] size: {im.size}, brightness: {sum(stat.mean)/3:.1f}, contrast: {sum(stat.stddev)/3:.1f}")
