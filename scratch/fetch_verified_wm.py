import urllib.request
import json
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

# Let's check Wikimedia files with known filenames:
wm_curated = {
    # 1. Multi-color modeling clay / plasticine bars / blocks:
    "wm_fimo_blocks_png": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Fimo_blocks.png",
    "wm_plastilin_ddr": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Plastilin-ddr.jpg",
    "wm_animacion_plastilina": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Animacion-con-plastilina-y-clay-animation-pelicula-Kuzmich-153.jpg",
    
    # 2. Polymer clay blocks / sampler:
    "wm_poly_examples_orig": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Polymer-clay-201113.jpg/1280px-Polymer-clay-201113.jpg",
    "wm_poly_2011_3": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Polymer-clay-2011-3.jpg/1280px-Polymer-clay-2011-3.jpg",
    "wm_fimo_earrings": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Fimo_earrings.jpg/1280px-Fimo_earrings.jpg",
    
    # 3. Earthenware / Clay blocks / Air dry clay:
    "wm_earthenware_block": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Block_of_mixed_earthenware_clay.JPG/1280px-Block_of_mixed_earthenware_clay.JPG"
}

os.makedirs('scratch/verified_curated', exist_ok=True)

for name, url in wm_curated.items():
    dest = f"scratch/verified_curated/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=12) as r:
            with open(dest, 'wb') as f:
                f.write(r.read())
        im = Image.open(dest)
        print(f"Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
