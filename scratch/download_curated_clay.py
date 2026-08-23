import urllib.request
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

candidates = {
    # 1. Modeling Clay Super Pack - 36 vibrant colors clay assortment / blocks
    "modeling_clay_unsplash_1": "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80",
    "modeling_clay_unsplash_2": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    "modeling_clay_unsplash_3": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    "modeling_clay_unsplash_4": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    
    # 2. Air Dry Clay 10 Pack - pottery / sculpting clay blocks
    "airdry_clay_unsplash_1": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    "airdry_clay_unsplash_2": "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80",
    "airdry_clay_unsplash_3": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "airdry_clay_unsplash_4": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    
    # 3. Premo Polymer Clay 30-Color Multipack - rich polymer clay colors
    "polymer_clay_unsplash_1": "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80",
    "polymer_clay_unsplash_2": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    "polymer_clay_unsplash_3": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
}

os.makedirs('scratch/test_curated', exist_ok=True)

for name, url in candidates.items():
    dest = f"scratch/test_curated/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as res:
            with open(dest, 'wb') as f:
                f.write(res.read())
        im = Image.open(dest)
        print(f"Downloaded: {name} -> {im.size}")
    except Exception as e:
        print(f"Failed {name}: {e}")
