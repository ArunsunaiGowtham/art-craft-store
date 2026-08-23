import urllib.request
import ssl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraft/1.0'}

def search_commons(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
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

queries = {
    'cyanotype': 'File:Cyanotype prints botanical',
    'linocut': 'File:Linocut print',
    'mosaic': 'File:Mosaic making tools',
    'stained_glass': 'File:Stained glass workshop',
    'leathercraft': 'File:Leather craft tools'
}

for k, q in queries.items():
    print(f"\n=== {k} ===")
    res = search_commons(q)
    for r in res:
        print(f"{r['title']} ({r['width']}x{r['height']}) -> {r['url']}")
