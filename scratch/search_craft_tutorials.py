import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 ArtCraftStoreBot/1.0'}

def search_commons(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                if 'imageinfo' in p and p['imageinfo']:
                    info = p['imageinfo'][0]
                    if info.get('mime') in ['image/jpeg', 'image/png', 'image/jpg']:
                        results.append({
                            'title': p['title'],
                            'url': info['url'],
                            'width': info.get('width'),
                            'height': info.get('height')
                        })
            return results
    except Exception as e:
        print("Error:", e)
        return []

print("=== SEARCH MACRAME TUTORIAL ===")
for r in search_commons('macrame knotting craft', 8):
    print(r['title'], r['width'], r['height'], r['url'])

print("\n=== SEARCH EMBROIDERY HOOP CRAFT ===")
for r in search_commons('embroidery hoop needlework craft', 8):
    print(r['title'], r['width'], r['height'], r['url'])

print("\n=== SEARCH RESIN CRAFT ===")
for r in search_commons('resin art craft', 8):
    print(r['title'], r['width'], r['height'], r['url'])
