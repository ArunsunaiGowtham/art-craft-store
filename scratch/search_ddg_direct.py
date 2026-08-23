import urllib.request
import urllib.parse
import json
import ssl
import re
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_ddg_images(query, max_results=10):
    url = "https://duckduckgo.com/"
    params = {'q': query}
    req = urllib.request.Request(url, data=urllib.parse.urlencode(params).encode('utf-8'), headers=headers)
    try:
        html = urllib.request.urlopen(req, context=ctx, timeout=10).read().decode('utf-8', errors='ignore')
        # get vqd
        m = re.search(r'vqd=([0-9\-]+)', html) or re.search(r'vqd="([0-9\-]+)"', html)
        if not m:
            print("No vqd found in DDG response")
            return []
        vqd = m.group(1)
        api_url = f"https://duckduckgo.com/i.js?l=us-en&o=json&q={urllib.parse.quote(query)}&vqd={vqd}&f=,,,&p=1"
        req2 = urllib.request.Request(api_url, headers=headers)
        res = json.loads(urllib.request.urlopen(req2, context=ctx, timeout=10).read().decode('utf-8'))
        results = []
        for r in res.get('results', []):
            results.append({
                'title': r.get('title'),
                'image': r.get('image'),
                'width': r.get('width'),
                'height': r.get('height')
            })
        return results[:max_results]
    except Exception as e:
        print("DDG search failed:", e)
        return []

os.makedirs('scratch/test_ddg_picks', exist_ok=True)

queries = [
    ("mod_clay_pack", "modeling clay 36 colors set pack white background product"),
    ("air_clay_pack", "air dry clay 10 pack assorted colors blocks product"),
    ("sculpey_pack", "sculpey premo polymer clay sampler pack 30 colors")
]

for tag, q in queries:
    print(f"\n=== Query: {q} ===")
    results = get_ddg_images(q, 5)
    for i, r in enumerate(results):
        print(f"  {r['title']} -> {r['image']}")
        dest = f"scratch/test_ddg_picks/{tag}_{i+1}.jpg"
        try:
            req_img = urllib.request.Request(r['image'], headers=headers)
            with urllib.request.urlopen(req_img, context=ctx, timeout=8) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                im = Image.open(dest)
                print(f"    Downloaded: {im.size} ({len(data)} bytes)")
        except Exception as e:
            print(f"    Download error: {e}")
