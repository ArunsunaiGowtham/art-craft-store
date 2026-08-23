import os
from PIL import Image

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root: continue
    for f in files:
        if f.endswith(('.jpg', '.png')) and any(k in f.lower() for k in ['pottery', 'clay', 'sculpt']):
            p = os.path.join(root, f)
            try:
                im = Image.open(p)
                print(f"{p:65s}: size={im.size}, bytes={os.path.getsize(p)}")
            except:
                pass
