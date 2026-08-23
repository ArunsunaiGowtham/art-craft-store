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

def get_category_images(category, limit=30):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(category)}&gcmnamespace=6&gcmlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                if info.get('mime') in ['image/jpeg', 'image/png']:
                    results.append({
                        'title': page.get('title'),
                        'url': info.get('url'),
                        'width': info.get('width', 0),
                        'height': info.get('height', 0)
                    })
    except Exception as e:
        print(f"Error category {category}:", e)
    return results

os.makedirs('scratch/wm_cats', exist_ok=True)

categories = [
    'Plasticine',
    'Polymer_clay',
    'Modelling_clay',
    'Play-Doh',
    'Clay_sculpture_materials',
    'Sculpting_materials'
]

for cat in categories:
    print(f"\n=== Category: {cat} ===")
    imgs = get_category_images(cat, 30)
    for it in imgs:
        print(f"{it['title']} ({it['width']}x{it['height']}) -> {it['url']}")
