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

def search_flickr(tags):
    url = f"https://api.flickr.com/services/feeds/photos_public.gne?tags={urllib.parse.quote(tags)}&format=json&nojsoncallback=1"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            return [it['media']['m'].replace('_m.jpg', '_b.jpg') for it in data.get('items', [])]
    except Exception as e:
        print(f"Error {tags}: {e}")
        return []

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/clay_products_flickr', exist_ok=True)

queries = [
    ("mod_colors", "modelingclay,colors"),
    ("plasticine_pack", "plasticine,colour"),
    ("fimo_colors", "fimo,colors"),
    ("fimo_blocks", "fimo,block"),
    ("polymer_pack", "polymerclay,palette"),
    ("air_dry_pack", "airdryclay"),
    ("sculpey_pack", "sculpey,colors")
]

for tag, q in queries:
    print(f"Searching: {q}")
    urls = search_flickr(q)
    for i, u in enumerate(urls[:5]):
        dest = f"scratch/clay_products_flickr/{tag}_{i+1}.jpg"
        try:
            download_img(u, dest)
            im = Image.open(dest)
            print(f"  [{tag}_{i+1}] {im.size} -> {u}")
        except Exception as e:
            print(f"  Failed: {e}")
