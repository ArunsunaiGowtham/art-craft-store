import urllib.request
import urllib.parse
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

# Let's search Unsplash and Flickr for colorful modeling clay bars
unsplash_candidates = [
    # Colorful modeling clay
    ("clay_bars_1", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"),
    ("clay_bars_2", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"),
    ("clay_bars_3", "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"),
    ("clay_bars_4", "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"),
    # Flickr direct creative commons
    ("flickr_plastilin", "https://live.staticflickr.com/4640/38832179674_266ba4446f_b.jpg"),
    ("flickr_plasticine", "https://live.staticflickr.com/4635/39511354142_76a587ddfb_b.jpg")
]

os.makedirs('scratch/new_modeling_clay', exist_ok=True)

for name, url in unsplash_candidates:
    dest = f"scratch/new_modeling_clay/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            with open(dest, 'wb') as f:
                f.write(r.read())
        im = Image.open(dest)
        print(f"Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
