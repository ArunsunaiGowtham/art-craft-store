import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_page_images(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&generator=images&gimlimit=10&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
    try:
        data = json.loads(urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for k, v in pages.items():
            if 'imageinfo' in v and len(v['imageinfo']) > 0:
                results.append((v['title'], v['imageinfo'][0]['url']))
        return results
    except Exception as e:
        print(f"Error {title}: {e}")
        return []

pages = [
    ("Paintbrush", "brush"),
    ("Oil_paint", "oil"),
    ("Acrylic_paint", "acrylic"),
    ("Calligraphy", "calligraphy")
]

for title, label in pages:
    print(f"\nImages on Wikipedia page: {title}")
    imgs = get_page_images(title)
    for i, (t, u) in enumerate(imgs):
        print(f"  {t} -> {u}")
        if u.endswith('.jpg') or u.endswith('.png') or u.endswith('.jpeg'):
            try:
                time.sleep(0.5)
                req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
                img_data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
                out_path = f"scratch/wiki_p_{label}_{i}.jpg"
                with open(out_path, "wb") as f:
                    f.write(img_data)
                print(f"    Saved {out_path} ({len(img_data)} bytes)")
            except Exception as e:
                print(f"    Failed: {e}")
