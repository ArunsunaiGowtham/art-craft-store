import urllib.request
import ssl
import json
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraftStore/1.0 (contact@artcraft.local)'}

def search_painting(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r:
        data = json.loads(r.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, p in pages.items():
            if 'imageinfo' in p and p['imageinfo']:
                info = p['imageinfo'][0]
                if info.get('mime') in ['image/jpeg', 'image/png']:
                    results.append({
                        'title': p['title'],
                        'url': info['url'],
                        'width': info.get('width'),
                        'height': info.get('height')
                    })
        return results

queries = [
    'File:Oil painting easel palette knife',
    'File:Plein air painting easel',
    'File:Artist painting canvas studio',
    'File:Watercolor painting palette'
]

for q in queries:
    print(f"\n=== {q} ===")
    res = search_painting(q)
    for r in res[:3]:
        print(f"{r['title']} ({r['width']}x{r['height']}) -> {r['url']}")
