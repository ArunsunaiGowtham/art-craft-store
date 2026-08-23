import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_files(term):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(term)}&srnamespace=6&srlimit=8&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/3.0 (contact@artcraft.com)'})
    try:
        res = json.loads(urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8'))
        titles = [item['title'] for item in res.get('query', {}).get('search', [])]
        return titles
    except Exception as e:
        print(f"Error {term}: {e}")
        return []

def get_image_url(file_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/3.0 (contact@artcraft.com)'})
    try:
        res = json.loads(urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8'))
        pages = res.get('query', {}).get('pages', {})
        for k, v in pages.items():
            if 'imageinfo' in v and len(v['imageinfo']) > 0:
                return v['imageinfo'][0]['url']
        return None
    except Exception as e:
        return None

queries = ["Charcoal drawing pencils", "Charcoal sticks artist", "Vine charcoal", "Drawing charcoal"]

for q in queries:
    print(f"\n--- {q} ---")
    titles = search_files(q)
    for i, t in enumerate(titles):
        time.sleep(0.4)
        u = get_image_url(t)
        if u and (u.endswith('.jpg') or u.endswith('.png') or u.endswith('.jpeg')):
            print(f"  [{i}] {t} -> {u}")
            try:
                time.sleep(0.4)
                req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/3.0'})
                img_data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
                out_path = f"scratch/charcoal_{i}_{q[:8].strip()}.jpg"
                with open(out_path, "wb") as f:
                    f.write(img_data)
                print(f"    -> Saved {out_path} ({len(img_data)} bytes)")
            except Exception as e:
                print(f"    -> Failed: {e}")
