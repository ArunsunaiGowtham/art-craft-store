import urllib.request
import urllib.parse
import json
import ssl
import re
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def search_unsplash_html(q):
    url = f"https://unsplash.com/s/photos/{urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            html = r.read().decode('utf-8', errors='ignore')
            # Extract photo URLs
            urls = re.findall(r'https://images\.unsplash\.com/photo-([a-zA-Z0-9_-]+)\?[^"\'\s]+', html)
            # deduplicate
            unique_ids = []
            for u in urls:
                if u not in unique_ids:
                    unique_ids.append(u)
            return unique_ids
    except Exception as e:
        print(f"Error {q}: {e}")
        return []

queries = [
    "modelling-clay",
    "plasticine",
    "polymer-clay",
    "air-dry-clay",
    "clay-blocks",
    "pottery-clay"
]

os.makedirs('scratch/unsplash_clay', exist_ok=True)

for q in queries:
    print(f"\nUnsplash search: {q}")
    ids = search_unsplash_html(q)
    print(f"Found {len(ids)} photo IDs")
    for pid in ids[:4]:
        img_url = f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w=800&q=80"
        dest = f"scratch/unsplash_clay/{q}_{pid[:8]}.jpg"
        try:
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                with open(dest, 'wb') as f:
                    f.write(resp.read())
            im = Image.open(dest)
            print(f"  Downloaded: {dest} -> {im.size}")
        except Exception as e:
            print(f"  Failed: {e}")
