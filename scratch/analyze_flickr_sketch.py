import os
from PIL import Image, ImageStat

def analyze(path):
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    return {
        'size': im.size,
        'aspect': round(im.size[0] / im.size[1], 2),
        'bright': round(sum(stat.mean)/3, 1),
        'contrast': round(sum(stat.stddev)/3, 1)
    }

for f in sorted(os.listdir('scratch/flickr_sketch')):
    p = os.path.join('scratch/flickr_sketch', f)
    res = analyze(p)
    print(f"{f:25s}: {res['size']}, aspect={res['aspect']}, bright={res['bright']}, contrast={res['contrast']}")
