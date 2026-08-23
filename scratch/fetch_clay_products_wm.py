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
    'User-Agent': 'ArtStoreCatalog/3.0 (admin@artcraftstore.org) python-urllib'
}

def search_wm_files(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit={limit}&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            return [res['title'] for res in data.get('query', {}).get('search', [])]
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

def get_file_info(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            for k, v in data.get('query', {}).get('pages', {}).items():
                if 'imageinfo' in v and len(v['imageinfo']) > 0:
                    return v['imageinfo'][0]
    except Exception as e:
        pass
    return None

def download_file(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/clay_products_new', exist_ok=True)

queries = [
    # Modeling Clay Super Pack (36-color modeling clay pack / sticks)
    "Plasticine blocks colored",
    "Modeling clay bars",
    "Plastilina colores",
    "Knetgummi bunt",
    
    # Air dry clay 10 pack (10-pack air dry clay colors)
    "Air drying clay colors",
    "Pottery clay blocks",
    "Ceramic clay blocks",
    
    # Polymer clay 30-color pack
    "Fimo blocks",
    "Polymer clay colors",
    "Sculpey polymer clay"
]

for q in queries:
    print(f"\nSearching: {q}")
    titles = search_wm_files(q, 8)
    for t in titles:
        if not any(t.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            continue
        clean_fn = "".join(x for x in t.replace('File:', '').replace(' ', '_') if x.isalnum() or x in "._-")
        dest = os.path.join('scratch/clay_products_new', clean_fn)
        if not os.path.exists(dest):
            info = get_file_info(t)
            if info and 'url' in info:
                try:
                    download_file(info['url'], dest)
                    im = Image.open(dest)
                    print(f"  {clean_fn} -> {im.size}")
                except Exception as e:
                    print(f"  Failed {clean_fn}: {e}")
        else:
            print(f"  Exists: {clean_fn}")
