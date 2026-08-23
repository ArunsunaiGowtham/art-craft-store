import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtCraftBot/1.0'}

def query_commons(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
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
    'File:Macrame',
    'File:Embroidery',
    'File:Resin',
    'File:Leathercraft',
    'macrame workshop',
    'embroidery hoop floral',
    'leather craft workshop',
    'pottery workshop hands'
]

for q in queries:
    print(f"\n--- {q} ---")
    res = query_commons(q)
    for r in res[:4]:
        print(f"{r['title']} ({r['width']}x{r['height']}) -> {r['url']}")
