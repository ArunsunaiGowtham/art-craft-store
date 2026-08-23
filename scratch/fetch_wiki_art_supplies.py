import urllib.request
import ssl
import json
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Querying Wikimedia Commons API for authentic art supplies
def search_wiki(query, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/1.0 (contact@artcraft.com)'})
    try:
        data = json.loads(urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, pdata in pages.items():
            if 'imageinfo' in pdata and len(pdata['imageinfo']) > 0:
                results.append(pdata['imageinfo'][0]['url'])
        return results
    except Exception as e:
        print(f"Error querying {query}: {e}")
        return []

searches = {
    "acrylic_tubes": "acrylic paint tubes",
    "calligraphy_nibs": "calligraphy pen nibs",
    "paint_brushes": "artist paint brushes set",
    "oil_paint_tubes": "oil paint tubes set",
    "textile_paint": "fabric paint bottles",
    "resin_art": "epoxy resin craft kit"
}

for key, q in searches.items():
    urls = search_wiki(q, 3)
    print(f"=== {key} ({len(urls)} found) ===")
    for i, u in enumerate(urls):
        print(f"  {u}")
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/1.0'})
            img_data = urllib.request.urlopen(req, context=ctx, timeout=10).read()
            with open(f"scratch/wiki_{key}_{i}.jpg", "wb") as f:
                f.write(img_data)
            print(f"    -> Saved scratch/wiki_{key}_{i}.jpg ({len(img_data)} bytes)")
        except Exception as e:
            print(f"    -> Failed: {e}")
