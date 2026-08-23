import urllib.request
import urllib.parse
import json
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_wikimedia_images(query, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query + ' filetype:bitmap')}&gsrlimit={limit}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                url = info.get('url', '')
                if any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    results.append({
                        'title': page.get('title'),
                        'url': url,
                        'width': info.get('width'),
                        'height': info.get('height')
                    })
            return results
    except Exception as e:
        print(f"Error searching {query}:", e)
        return []

print("=== Search: Plasticine ===")
for r in search_wikimedia_images("Plasticine clay colors", 8):
    print(r['title'], r['url'])

print("\n=== Search: Modelling clay ===")
for r in search_wikimedia_images("Modelling clay blocks colorful", 8):
    print(r['title'], r['url'])

print("\n=== Search: Polymer clay ===")
for r in search_wikimedia_images("Polymer clay Fimo Sculpey", 8):
    print(r['title'], r['url'])

print("\n=== Search: Pottery clay blocks ===")
for r in search_wikimedia_images("Pottery clay terracotta air dry", 8):
    print(r['title'], r['url'])
