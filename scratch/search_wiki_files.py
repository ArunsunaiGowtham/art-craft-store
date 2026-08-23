import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_files(term):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(term)}&srnamespace=6&srlimit=5&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/1.0'})
    res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
    titles = [item['title'] for item in res.get('query', {}).get('search', [])]
    return titles

def get_image_url(file_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/1.0'})
    res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
    pages = res.get('query', {}).get('pages', {})
    for k, v in pages.items():
        if 'imageinfo' in v:
            return v['imageinfo'][0]['url']
    return None

terms = [
    ("acrylic_paint", "Acrylic paint tubes"),
    ("calligraphy_set", "Calligraphy nibs pen"),
    ("paintbrushes", "Artist paint brushes set"),
    ("oil_paints", "Oil paint tubes"),
    ("fabric_paint", "Textile paint colors"),
    ("resin_craft", "Epoxy resin art craft")
]

for name, term in terms:
    print(f"\n--- Searching: {term} ---")
    titles = search_files(term)
    for i, t in enumerate(titles):
        img_url = get_image_url(t)
        print(f"  {t} -> {img_url}")
        if img_url and (img_url.endswith('.jpg') or img_url.endswith('.png') or img_url.endswith('.jpeg')):
            try:
                req = urllib.request.Request(img_url, headers={'User-Agent': 'ArtCraftStore/1.0'})
                img_data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
                out_path = f"scratch/wiki_{name}_{i}.jpg"
                with open(out_path, "wb") as f:
                    f.write(img_data)
                print(f"    -> Saved {out_path} ({len(img_data)} bytes)")
            except Exception as e:
                print(f"    -> Error: {e}")
