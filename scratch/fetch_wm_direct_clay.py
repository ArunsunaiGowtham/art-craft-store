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
    'User-Agent': 'ArtCraftStoreProject/1.0 (https://github.com/ArunsunaiGowtham/art-craft-store; student@example.com) python-urllib'
}

def search_wm_files(query, limit=15):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                mime = info.get('mime', '')
                if 'image' in mime:
                    results.append({
                        'title': page.get('title'),
                        'url': info.get('url'),
                        'width': info.get('width'),
                        'height': info.get('height')
                    })
    except Exception as e:
        print(f"Error searching {query}:", e)
    return results

os.makedirs('scratch/wm_direct_clay', exist_ok=True)

searches = [
    ("mod_clay", "plasticine bars filetype:bitmap"),
    ("poly_clay", "fimo blocks filetype:bitmap"),
    ("air_clay", "play dough filetype:bitmap")
]

for tag, q in searches:
    print(f"\n=== Search: {q} ===")
    res = search_wm_files(q, 10)
    for i, it in enumerate(res):
        print(f"{it['title']} ({it['width']}x{it['height']}) -> {it['url']}")
        dest = f"scratch/wm_direct_clay/{tag}_{i+1}.jpg"
        try:
            req = urllib.request.Request(it['url'], headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                im = Image.open(dest)
                print(f"  Downloaded: {im.size} ({len(data)} bytes)")
            time.sleep(1)
        except Exception as e:
            print(f"  Failed: {e}")
