import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtCraftStore/1.0'}

def search_commons(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
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

res = search_commons('oil paint palette tubes canvas')
for r in res[:6]:
    print(r['title'], r['width'], r['height'], r['url'])
