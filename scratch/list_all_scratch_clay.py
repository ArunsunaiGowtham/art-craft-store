import os
from PIL import Image

found = []
for root, dirs, files in os.walk('scratch'):
    for f in files:
        if f.endswith(('.jpg', '.png', '.jpeg', '.JPG', '.PNG')):
            p = os.path.join(root, f)
            try:
                im = Image.open(p)
                found.append((p, im.size, os.path.getsize(p)))
            except:
                pass

print(f"Total image files in scratch: {len(found)}")
for p, sz, bytes_sz in sorted(found):
    if any(k in p.lower() for k in ['clay', 'plast', 'sculp', 'fimo', 'poly', 'potter', 'model']):
        print(f"  {p:60s}: {sz} ({bytes_sz} bytes)")
