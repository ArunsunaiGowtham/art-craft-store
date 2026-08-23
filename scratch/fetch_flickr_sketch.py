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

def search_flickr_public(tags):
    url = f"https://api.flickr.com/services/feeds/photos_public.gne?tags={urllib.parse.quote(tags)}&format=json&nojsoncallback=1"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            items = data.get('items', [])
            return [it['media']['m'].replace('_m.jpg', '_b.jpg') for it in items]
    except Exception as e:
        print("Error flickr:", e)
        return []

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/flickr_sketch', exist_ok=True)

queries = [
    ("sketchbook_hardcover", "sketchbook"),
    ("sketchbook_black", "moleskine,sketchbook"),
    ("watercolor_pad", "watercolor,paper"),
    ("arches_paper", "arches,watercolor"),
    ("cold_press_pad", "watercolor,block")
]

for tag, q in queries:
    print(f"Searching Flickr: {q}")
    urls = search_flickr_public(q)
    for i, u in enumerate(urls[:5]):
        dest = f"scratch/flickr_sketch/{tag}_{i+1}.jpg"
        try:
            download_img(u, dest)
            im = Image.open(dest)
            print(f"  [{tag}_{i+1}] {im.size} -> {u}")
        except Exception as e:
            print(f"  Failed {u}: {e}")
