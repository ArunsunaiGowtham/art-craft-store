import urllib.request
import urllib.parse
import json
import ssl
import os
import time
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def search_unsplash(query):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page=10"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            for item in data.get('results', []):
                results.append({
                    'id': item['id'],
                    'desc': item.get('alt_description') or item.get('description'),
                    'url': item['urls']['raw'] + '&w=1200&auto=format&fit=crop&q=85'
                })
    except Exception as e:
        print(f"Unsplash error ({query}):", e)
    return results

os.makedirs('scratch/unsplash_clay_test', exist_ok=True)

queries = [
    ("mod_clay", "colorful modeling clay"),
    ("plasticine", "plasticine colors"),
    ("playdough", "colorful play dough"),
    ("air_clay", "craft clay blocks"),
    ("polymer_clay", "polymer clay colors")
]

for tag, q in queries:
    print(f"\n=== Searching Unsplash: {q} ===")
    res = search_unsplash(q)
    for i, item in enumerate(res[:4]):
        name = f"{tag}_{i+1}"
        dest = f"scratch/unsplash_clay_test/{name}.jpg"
        print(f"  [{name}] {item['desc']} -> {item['url']}")
        try:
            req = urllib.request.Request(item['url'], headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                im = Image.open(dest)
                print(f"    Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
        except Exception as e:
            print(f"    Failed download {name}: {e}")
        time.sleep(1)
