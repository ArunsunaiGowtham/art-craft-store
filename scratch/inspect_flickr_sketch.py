import os
from PIL import Image

for f in sorted(os.listdir('scratch/flickr_sketch')):
    p = os.path.join('scratch/flickr_sketch', f)
    im = Image.open(p)
    print(f"{f:25s}: size={im.size}, aspect={im.size[0]/im.size[1]:.2f}, bytes={os.path.getsize(p)}")
