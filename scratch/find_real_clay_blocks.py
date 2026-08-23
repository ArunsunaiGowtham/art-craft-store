import os
from PIL import Image

keywords = ['clay_blocks', 'polymer_clay', 'animacion', 'plastilin', 'sculpey', 'fimo']
for root, dirs, files in os.walk('scratch'):
    for f in files:
        if f.endswith(('.jpg', '.png')) and any(k in f.lower() for k in keywords):
            p = os.path.join(root, f)
            try:
                im = Image.open(p)
                print(f"{p:60s}: size={im.size}, bytes={os.path.getsize(p)}")
            except:
                pass
