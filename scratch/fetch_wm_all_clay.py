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
    'User-Agent': 'ArtCraftStoreApp/2.0 (admin@artcraftstore.local) python-urllib'
}

def get_category_files(cat):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat)}&gcmtype=file&gcmlimit=50&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            files = []
            for k, v in pages.items():
                title = v.get('title')
                info = v.get('imageinfo', [{}])[0]
                url = info.get('url')
                if url and any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    files.append({'title': title, 'url': url, 'width': info.get('width'), 'height': info.get('height')})
            return files
    except Exception as e:
        print(f"Error {cat}: {e}")
        return []

def download_img(url, dest):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(dest, 'wb') as f:
            f.write(data)
        return len(data)

cats = [
    "Polymer_clay",
    "Plasticine",
    "Ceramic_materials",
    "Pottery_materials"
]

os.makedirs('scratch/wm_all_clay', exist_ok=True)

for c in cats:
    print(f"\n=== Category: {c} ===")
    files = get_category_files(c)
    print(f"Found {len(files)} files")
    for f in files:
        fn = f['title'].replace('File:', '').replace(' ', '_')
        # Filter out obvious non-product or complex filenames
        clean_fn = "".join(x for x in fn if x.isalnum() or x in "._-")
        dest = os.path.join('scratch/wm_all_clay', clean_fn)
        if not os.path.exists(dest):
            try:
                download_img(f['url'], dest)
                im = Image.open(dest)
                print(f"  {clean_fn} -> {im.size}")
            except Exception as e:
                print(f"  Failed {clean_fn}: {e}")
        else:
            print(f"  Already exists: {clean_fn}")
