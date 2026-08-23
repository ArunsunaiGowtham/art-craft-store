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
    'User-Agent': 'ArtStoreCurator/1.0 (artstore@example.org) python-urllib'
}

def search_wm_files(query, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit={limit}&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            return [res['title'] for res in results]
    except Exception as e:
        print(f"Error searching {query}: {e}")
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
        print(f"Error getting info {title}: {e}")
    return None

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

queries = [
    "Plasticine blocks",
    "Polymer clay blocks",
    "Fimo polymer clay",
    "Air drying clay",
    "Modelling clay colors",
    "Pottery clay block",
    "Sculpting clay bars",
    "Plastilina"
]

os.makedirs('scratch/wm_all_clay', exist_ok=True)

downloaded = []

for q in queries:
    print(f"\n=== Query: {q} ===")
    titles = search_wm_files(q, 15)
    print(f"Found {len(titles)} titles")
    for t in titles:
        if not any(t.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            continue
        clean_fn = "".join(x for x in t.replace('File:', '').replace(' ', '_') if x.isalnum() or x in "._-")
        dest = os.path.join('scratch/wm_all_clay', clean_fn)
        if not os.path.exists(dest):
            info = get_file_info(t)
            if info and 'url' in info:
                try:
                    download_img(info['url'], dest)
                    im = Image.open(dest)
                    print(f"  Downloaded: {clean_fn} -> {im.size} ({os.path.getsize(dest)} bytes)")
                    downloaded.append((clean_fn, im.size, q))
                except Exception as e:
                    print(f"  Failed {clean_fn}: {e}")
        else:
            print(f"  Already exists: {clean_fn}")

print(f"\nTotal new downloads: {len(downloaded)}")
