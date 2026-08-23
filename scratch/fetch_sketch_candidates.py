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
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit={limit}&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            return [res['title'] for res in results]
    except Exception as e:
        print(f"Error search {query}:", e)
        return []

def get_file_info(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for k, v in pages.items():
                if 'imageinfo' in v and len(v['imageinfo']) > 0:
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

os.makedirs('scratch/sketch_candidates', exist_ok=True)

queries = [
    # Arches / Cotton watercolor pad
    "Arches watercolor paper block",
    "Watercolor paper pad cotton",
    "Arches paper",
    "Cotton paper pad art",
    
    # Hardcover sketchbook
    "Hardcover sketchbook black open",
    "Artist sketchbook blank pages",
    "Moleskine sketchbook black",
    "Sketchbook open drawings pencil"
]

for q in queries:
    print(f"\n=== Searching: {q} ===")
    titles = search_wikimedia(q, 6)
    for t in titles:
        if not any(t.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            continue
        clean_fn = "".join(x for x in t.replace('File:', '').replace(' ', '_') if x.isalnum() or x in "._-")
        dest = os.path.join('scratch/sketch_candidates', clean_fn)
        if not os.path.exists(dest):
            info = get_file_info(t)
            if info and 'url' in info:
                try:
                    download_file(info['url'], dest)
                    im = Image.open(dest)
                    print(f"  Downloaded: {clean_fn} -> {im.size} ({os.path.getsize(dest)} bytes)")
                except Exception as e:
                    print(f"  Failed: {e}")
        else:
            print(f"  Already exists: {clean_fn}")
