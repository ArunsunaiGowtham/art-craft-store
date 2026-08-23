import os
from PIL import Image, ImageStat

for f in sorted(os.listdir('scratch/clay_products_flickr')):
    p = os.path.join('scratch/clay_products_flickr', f)
    im = Image.open(p).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"{f:25s}: size={im.size}, aspect={im.size[0]/im.size[1]:.2f}, bright={sum(stat.mean)/3:.1f}, contrast={sum(stat.stddev)/3:.1f}")
