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
    'User-Agent': 'ArtCraftStoreApp/2.0 (admin@artcraftstore.local) python-urllib'
}

def search_wikimedia(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            return [res['title'] for res in results][:limit]
    except Exception as e:
        print(f"Error search {query}:", e)
        return []

def get_image_info(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for k, v in pages.items():
                if 'imageinfo' in v:
                    return v['imageinfo'][0]
    except Exception as e:
        print(f"Error info {title}:", e)
    return None

def download_file(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

queries = [
    "Plastilina colors",
    "Modeling clay colored",
    "Fimo polymer clay",
    "Sculpey clay blocks",
    "Air dry clay white terracotta",
    "Pottery clay blocks studio",
    "Polymer clay colors bars",
    "Plastilin bunter"
]

os.makedirs('scratch/wm_clay', exist_ok=True)

for q in queries:
    print(f"\n=== Searching: {q} ===")
    titles = search_wikimedia(q, 6)
    for t in titles:
        if not any(t.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            continue
        info = get_image_info(t)
        if info and 'url' in info:
            filename = t.replace('File:', '').replace(' ', '_')
            outpath = os.path.join('scratch/wm_clay', filename)
            try:
                size = download_file(info['url'], outpath)
                im = Image.open(outpath)
                print(f"  Downloaded: {filename} -> {im.size}, {size} bytes")
            except Exception as e:
                print(f"  Failed {filename}: {e}")
