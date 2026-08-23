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
    'User-Agent': 'ArtCraftStore/2.0 (contact@artcraftstore.com)'
}

def search_openverse(query, page_size=10):
    url = f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(query)}&page_size={page_size}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = []
            for item in data.get('results', []):
                results.append({
                    'title': item.get('title'),
                    'url': item.get('url'),
                    'thumbnail': item.get('thumbnail'),
                    'width': item.get('width'),
                    'height': item.get('height')
                })
            return results
    except Exception as e:
        print(f"Error searching Openverse for '{query}':", e)
        return []

def download_image(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        data = resp.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

os.makedirs('scratch/openverse_clay', exist_ok=True)

queries = [
    ("modeling_clay", "modeling clay colors set blocks"),
    ("air_dry_clay", "air dry clay terracotta white pottery blocks"),
    ("polymer_clay", "polymer clay colors bars fimo sculpey")
]

for tag, q in queries:
    print(f"\n=== Searching Openverse: {q} ===")
    results = search_openverse(q, 8)
    for i, r in enumerate(results):
        print(f"[{i+1}] {r['title']} -> {r['thumbnail'] or r['url']}")
        out_fn = f"scratch/openverse_clay/{tag}_{i+1}.jpg"
        u = r['url'] or r['thumbnail']
        try:
            download_image(u, out_fn)
            im = Image.open(out_fn)
            print(f"    Saved: {im.size} ({os.path.getsize(out_fn)} bytes)")
        except Exception as e:
            print(f"    Failed: {e}")
