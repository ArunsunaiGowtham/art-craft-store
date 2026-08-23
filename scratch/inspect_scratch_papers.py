import os
from PIL import Image

keywords = ['paper', 'pad', 'sketch', 'arches', 'cotton', 'journal', 'book', 'block']
for f in sorted(os.listdir('scratch')):
    if f.endswith(('.jpg', '.png')) and any(k in f.lower() for k in keywords):
        p = os.path.join('scratch', f)
        try:
            im = Image.open(p)
            print(f"{f:35s}: size={im.size}, bytes={os.path.getsize(p)}")
        except:
            pass
