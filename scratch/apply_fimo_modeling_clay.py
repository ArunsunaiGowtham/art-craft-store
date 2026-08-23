import shutil
import os
from PIL import Image

src = 'scratch/crop_samples/poly_fimo_blocks.jpg'
dest = 'images/product-modeling-clay-pack.jpg'

im = Image.open(src).convert('RGB')
im = im.resize((800, 600), Image.LANCZOS)
im.save(dest, 'JPEG', quality=95)

print(f"Saved {dest}: {im.size} ({os.path.getsize(dest)} bytes)")
