import os
from PIL import Image, ImageStat

for name, path in [('test_tag_1', 'scratch/test_tag_1.jpg'), ('test_pad_3', 'scratch/test_pad_3.jpg'), ('test_tag_2', 'scratch/test_tag_2.jpg')]:
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{name}]")
    print(f"  Dimensions: {im.size}")
    print(f"  Mean RGB: {stat.mean}")
    print(f"  StdDev RGB: {stat.stddev}")
    print(f"  Median: {stat.median}")
