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

def get_category_members(cat_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote('Category:' + cat_name)}&cmtype=file&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        return [m['title'] for m in data.get('query', {}).get('categorymembers', [])]

def get_file_info(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for k, v in pages.items():
            if 'imageinfo' in v:
                return v['imageinfo'][0]
    return None

def download_file(url, outpath):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        data = r.read()
        with open(outpath, 'wb') as f:
            f.write(data)
        return len(data)

categories = [
    "Plasticine",
    "Polymer clay",
    "Modelling clay",
    "Play-Doh",
    "Pottery clay"
]

os.makedirs('scratch/wm_cats', exist_ok=True)

for cat in categories:
    print(f"=== Category: {cat} ===")
    try:
        members = get_category_members(cat)
        print(f"Found {len(members)} files in Category:{cat}")
        for m in members[:15]:
            if not any(m.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                continue
            info = get_file_info(m)
            if info:
                fn = m.replace('File:', '').replace(' ', '_')
                outpath = os.path.join('scratch/wm_cats', fn)
                download_file(info['url'], outpath)
                im = Image.open(outpath)
                print(f"  {fn} -> {im.size}")
    except Exception as e:
        print(f"Error in {cat}: {e}")
