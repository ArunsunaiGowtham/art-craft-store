import os
from PIL import Image

files = [f for f in os.listdir('scratch') if f.endswith('.jpg') and any(k in f.lower() for k in ['clay', 'sculpey', 'polymer', 'pottery', 'model'])]
print(f"Found {len(files)} files:")
for f in sorted(files):
    p = os.path.join('scratch', f)
    try:
        im = Image.open(p)
        print(f"  {f:30s} : {im.size} (aspect: {im.size[0]/im.size[1]:.2f}) - {os.path.getsize(p)} bytes")
    except Exception as e:
        print(f"  {f:30s} : Error ({e})")
