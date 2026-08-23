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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Let's search Wikimedia Commons specifically for "Plastilin" (German/Russian for modeling clay) and "Modelling clay"
def search_wm(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, page in pages.items():
            info = page.get('imageinfo', [{}])[0]
            if info.get('url'):
                results.append((page.get('title'), info['url']))
        return results

queries = [
    "Plastilin Stangen",
    "Knetmasse bunt",
    "Plasticine colours",
    "Fimo Soft Farben",
    "Polymer clay canes",
    "Air dry clay pottery",
    "Tonmasse Keramik",
    "Clay slab pottery"
]

os.makedirs('scratch/wm_candidates', exist_ok=True)

for q in queries:
    print(f"\nSearch: {q}")
    for title, url in search_wm(q):
        if any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            fn = "".join(c for c in title.replace('File:', '').replace(' ', '_') if c.isalnum() or c in "._-")
            dest = f"scratch/wm_candidates/{fn}"
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                    with open(dest, 'wb') as f:
                        f.write(resp.read())
                im = Image.open(dest)
                print(f"  {fn} -> {im.size}")
            except Exception as e:
                print(f"  Failed {fn}: {e}")
