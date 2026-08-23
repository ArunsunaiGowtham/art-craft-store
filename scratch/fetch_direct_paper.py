import urllib.request
import json
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'ArtStoreCatalog/2.0 (admin@artstore.org) python-urllib'
}

def download_file(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

# Let's test specific Wikimedia images of art paper, drawing pads, and watercolor blocks
wm_photos = {
    "wm_sketchpad": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/The_International_studio_%28IA_internationalstu7831unse%29.pdf/page33-1024px-The_International_studio_%28IA_internationalstu7831unse%29.pdf.jpg",
    "wm_cotton_rag": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Whatman_paper.jpg/1280px-Whatman_paper.jpg",
    "wm_drawing_pad": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Papier_a_dessin_Canson.jpg/1280px-Papier_a_dessin_Canson.jpg"
}

os.makedirs('scratch/wm_direct_paper', exist_ok=True)

for name, url in wm_photos.items():
    dest = f"scratch/wm_direct_paper/{name}.jpg"
    try:
        download_file(url, dest)
        im = Image.open(dest)
        print(f"Downloaded {name} -> {im.size}")
    except Exception as e:
        print(f"Failed {name}: {e}")
