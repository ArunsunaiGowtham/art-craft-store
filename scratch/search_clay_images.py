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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_wikimedia(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                results.append({
                    'title': page.get('title'),
                    'url': info.get('url'),
                    'width': info.get('width'),
                    'height': info.get('height'),
                    'mime': info.get('mime')
                })
            return results
    except Exception as e:
        print("Error searching wikimedia:", e)
        return []

print("=== Search 1: Modeling Clay ===")
for r in search_wikimedia("modeling clay colorful blocks", 5):
    print(r['title'], r['url'])

print("\n=== Search 2: Air Dry Clay / Pottery Clay ===")
for r in search_wikimedia("air dry clay pottery craft", 5):
    print(r['title'], r['url'])

print("\n=== Search 3: Polymer Clay ===")
for r in search_wikimedia("polymer clay colors sculpey", 5):
    print(r['title'], r['url'])
