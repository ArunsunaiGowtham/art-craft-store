import os
from PIL import Image

for f in sorted(os.listdir('scratch')):
    if f.endswith(('.jpg', '.png')) and any(w in f.lower() for w in ['clay', 'sculpey', 'poly', 'potter', 'craft', 'raw']):
        p = os.path.join('scratch', f)
        try:
            im = Image.open(p)
            print(f"{f:35s}: size={im.size}, bytes={os.path.getsize(p)}")
        except:
            pass
