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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Let's search Flickr public API with exact tags for actual products
def search_flickr_json(query):
    url = f"https://api.flickr.com/services/feeds/photos_public.gne?tags={urllib.parse.quote(query)}&format=json&nojsoncallback=1"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            return [it['media']['m'].replace('_m.jpg', '_b.jpg') for it in data.get('items', [])]
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/product_packs', exist_ok=True)

# Let's search Wikimedia Commons using direct API queries for product boxes/packs
def search_wm(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                if info.get('url'):
                    results.append((page.get('title'), info['url']))
            return results
    except Exception as e:
        print(f"Error WM {q}: {e}")
        return []

queries_wm = [
    "Plastilina set",
    "Modeling clay box",
    "Fimo Soft set",
    "Polymer clay pack",
    "Plasticine pack",
    "Sculpey clay pack",
    "Air dry clay colors",
    "Play clay colors pack"
]

for q in queries_wm:
    print(f"\nWM Query: {q}")
    for title, url in search_wm(q):
        if any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            clean_fn = "".join(c for c in title.replace('File:', '').replace(' ', '_') if c.isalnum() or c in "._-")
            dest = f"scratch/product_packs/{clean_fn}"
            try:
                download_img(url, dest)
                im = Image.open(dest)
                print(f"  {clean_fn} -> {im.size}")
            except Exception as e:
                print(f"  Failed {clean_fn}: {e}")
