import os
from PIL import Image

for f in sorted(os.listdir('scratch/openverse_products')):
    p = os.path.join('scratch/openverse_products', f)
    im = Image.open(p)
    print(f"{f:25s}: size={im.size}, bytes={os.path.getsize(p)}")
