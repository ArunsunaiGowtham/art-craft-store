import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def search_wm(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        results = data.get('query', {}).get('search', [])
        return [res['title'] for res in results]

def get_image_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for k, v in pages.items():
            if 'imageinfo' in v:
                return v['imageinfo'][0]
    return None

for query in ["Plasticine", "Clay modeling", "Polymer clay", "Pottery clay"]:
    print(f"=== {query} ===")
    titles = search_wm(query)[:6]
    for t in titles:
        info = get_image_url(t)
        if info:
            print(f"  {t} -> {info.get('url')}")
