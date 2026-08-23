import urllib.request
import json
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Let's test a few specific candidate URLs for Arches watercolor block and Hardcover sketchbook
candidates = {
    "arches_block_1": "https://m.media-amazon.com/images/I/71Y6Nq8fHUL._AC_SL1500_.jpg",
    "arches_block_2": "https://images-na.ssl-images-amazon.com/images/I/71u9sJmE3-L.jpg",
    "arches_block_3": "https://i5.walmartimages.com/asr/3fa6972e-d007-4224-814d-fa7d5f0426f8.1df6e104e1329c36203cf65d4b528f11.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "sketchbook_hardcover_a4_1": "https://images-na.ssl-images-amazon.com/images/I/71wZ8rV2HIL.jpg",
    "sketchbook_hardcover_a4_2": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
}

os.makedirs('scratch/test_paper', exist_ok=True)

for name, url in candidates.items():
    dest = f"scratch/test_paper/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as r:
            with open(dest, 'wb') as f:
                f.write(r.read())
        im = Image.open(dest)
        print(f"Downloaded {name} -> {im.size}")
    except Exception as e:
        print(f"Failed {name}: {e}")
