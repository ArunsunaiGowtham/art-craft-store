import urllib.request
import ssl
import json
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def search_unsplash(term):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(term)}&per_page=5"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = data.get('results', [])
            print(f"\n=== Unsplash: {term} ({len(results)} found) ===")
            for item in results:
                raw_url = item['urls']['raw']
                desc = item.get('alt_description') or item.get('description') or 'No desc'
                print(f"ID: {item['id']} | Desc: {desc[:50]} | URL: {raw_url}")
    except Exception as e:
        print(f"Error {term}: {e}")

search_unsplash("artist drawing pencil")
search_unsplash("sketching paper")
search_unsplash("architectural sketch")
