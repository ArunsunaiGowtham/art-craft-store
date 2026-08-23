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

def search_wm_titles(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit=15&format=json"
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

queries = [
    "Plasticine sticks",
    "Modelling clay bars",
    "Plastilina barras",
    "Knetmasse bunt",
    "Play-Doh colors"
]

os.makedirs('scratch/wm_clay_picks', exist_ok=True)

for q in queries:
    print(f"\nQuery: {q}")
    for t in search_wm_titles(q):
        print(f"  Found: {t}")
        if any(t.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            clean_fn = "".join(x for x in t.replace('File:', '').replace(' ', '_') if x.isalnum() or x in "._-")
            dest = f"scratch/wm_clay_picks/{clean_fn}"
            if not os.path.exists(dest):
                info = get_file_info(t)
                if info and 'url' in info:
                    try:
                        download_file(info['url'], dest)
                        im = Image.open(dest)
                        print(f"    Downloaded {clean_fn} -> {im.size}")
                    except Exception as e:
                        print(f"    Failed: {e}")
