import urllib.request
import urllib.parse
import json
import ssl
import re
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def search_unsplash_photos(query, limit=10):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page={limit}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = []
            for item in data.get('results', []):
                results.append({
                    'id': item.get('id'),
                    'alt': item.get('alt_description') or item.get('description'),
                    'url': item.get('urls', {}).get('regular') or item.get('urls', {}).get('small')
                })
            return results
    except Exception as e:
        print(f"Error searching Unsplash for {query}:", e)
        return []

queries = [
    "modeling clay",
    "clay sculpting blocks",
    "air dry clay",
    "pottery clay",
    "polymer clay",
    "colorful clay"
]

for q in queries:
    print(f"\n=== Unsplash Search: {q} ===")
    photos = search_unsplash_photos(q, 6)
    for p in photos:
        print(f"  [{p['id']}] {p['alt']} -> {p['url']}")
