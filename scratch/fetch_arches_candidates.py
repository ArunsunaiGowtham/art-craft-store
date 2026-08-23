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

# Let's search Flickr public API with specific tags: "archespaper", "watercolorpaper", "watercolorblock", "archesaquarelle", "canson"
def search_flickr(tags):
    url = f"https://api.flickr.com/services/feeds/photos_public.gne?tags={urllib.parse.quote(tags)}&format=json&nojsoncallback=1"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            return [it['media']['m'].replace('_m.jpg', '_b.jpg') for it in data.get('items', [])]
    except Exception as e:
        print(f"Error {tags}:", e)
        return []

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/arches_candidates', exist_ok=True)

tags_list = [
    ("arches_tag", "archesaquarelle"),
    ("pad_tag", "watercolorpaper,pad"),
    ("block_tag", "watercolorblock,paper"),
    ("paper_tag", "cottonpaper,art")
]

for tag, t in tags_list:
    print(f"Searching: {t}")
    urls = search_flickr(t)
    for i, u in enumerate(urls[:5]):
        dest = f"scratch/arches_candidates/{tag}_{i+1}.jpg"
        try:
            download_img(u, dest)
            im = Image.open(dest)
            print(f"  [{tag}_{i+1}] {im.size} -> {u}")
        except Exception as e:
            print(f"  Failed: {e}")
