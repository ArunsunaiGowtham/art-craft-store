import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_wiki_images(term):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(term)}&srnamespace=6&srlimit=6&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
    res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
    titles = [item['title'] for item in res.get('query', {}).get('search', [])]
    
    images = []
    for t in titles:
        time.sleep(0.5)
        url_info = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url&format=json"
        req_info = urllib.request.Request(url_info, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
        data = json.loads(urllib.request.urlopen(req_info, context=ctx).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for k, v in pages.items():
            if 'imageinfo' in v:
                u = v['imageinfo'][0]['url']
                if u.endswith('.jpg') or u.endswith('.png') or u.endswith('.jpeg'):
                    images.append((t, u))
    return images

queries = [
    ("brushes", "Paintbrushes"),
    ("oil_tubes", "Oil paints tubes"),
    ("fabric_colors", "Textile colors")
]

for label, q in queries:
    print(f"\nSearching for {label} ({q})...")
    imgs = get_wiki_images(q)
    for i, (title, img_url) in enumerate(imgs):
        print(f"  [{i}] {title} -> {img_url}")
        try:
            time.sleep(0.5)
            req = urllib.request.Request(img_url, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
            data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
            out_file = f"scratch/wiki_{label}_{i}.jpg"
            with open(out_file, "wb") as f:
                f.write(data)
            print(f"      Downloaded {out_file} ({len(data)} bytes)")
        except Exception as e:
            print(f"      Failed: {e}")
