import os
from PIL import Image

for f in sorted(os.listdir('scratch/flickr_clay')):
    p = os.path.join('scratch/flickr_clay', f)
    try:
        im = Image.open(p)
        print(f"{f:25s}: size={im.size}, aspect={im.size[0]/im.size[1]:.2f}, bytes={os.path.getsize(p)}")
    except Exception as e:
        print(f"{f}: {e}")
