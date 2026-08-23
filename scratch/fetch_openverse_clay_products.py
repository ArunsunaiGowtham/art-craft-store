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

def search_openverse(query, limit=10):
    url = f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(query)}&page_size={limit}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = []
            for item in data.get('results', []):
                results.append({
                    'title': item.get('title'),
                    'url': item.get('url'),
                    'thumbnail': item.get('thumbnail')
                })
            return results
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

def download_file(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/openverse_products', exist_ok=True)

queries = [
    ("mod_clay", "plasticine modeling clay bars"),
    ("air_clay", "air dry clay pack"),
    ("poly_clay", "fimo polymer clay colors")
]

for tag, q in queries:
    print(f"\nOpenverse Search: {q}")
    items = search_openverse(q, 8)
    for i, it in enumerate(items):
        print(f"  [{i+1}] {it['title']} -> {it['thumbnail']}")
        u = it['thumbnail'] or it['url']
        if u:
            dest = f"scratch/openverse_products/{tag}_{i+1}.jpg"
            try:
                download_file(u, dest)
                im = Image.open(dest)
                print(f"      Saved: {im.size} ({os.path.getsize(dest)} bytes)")
            except Exception as e:
                print(f"      Failed: {e}")
