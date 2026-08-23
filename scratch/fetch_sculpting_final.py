import urllib.request
import urllib.parse
import json
import ssl
import os
import time
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtCraftStoreSculptingStudio/3.0 (Windows NT 10.0; Win64; x64) educational_photo_fetcher'}

os.makedirs('scratch/sculpting_final_candidates', exist_ok=True)

queries = [
    ("mod_clay", "plasticine colors"),
    ("fimo_clay", "fimo polymer clay"),
    ("air_clay", "air drying clay"),
    ("pottery_clay", "pottery clay sculpting"),
    ("play_clay", "plasticine modeling")
]

for key, q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, info in pages.items():
                img_info = info.get('imageinfo', [{}])[0]
                img_url = img_info.get('url')
                mime = img_info.get('mime', '')
                w = img_info.get('width', 0)
                h = img_info.get('height', 0)
                if img_url and 'image' in mime and w >= 600 and h >= 400:
                    filename = os.path.basename(img_url).replace('/', '_').replace(' ', '_')
                    dest = f"scratch/sculpting_final_candidates/{key}_{filename[:40]}.jpg"
                    if not os.path.exists(dest):
                        try:
                            time.sleep(1)
                            dl_req = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(dl_req, timeout=15) as dl_res:
                                content = dl_res.read()
                                with open(dest, 'wb') as f:
                                    f.write(content)
                                print(f"Saved {dest} ({len(content)/1024:.1f} KB, {w}x{h})")
                        except Exception as dl_err:
                            print(f"Error downloading {img_url}: {dl_err}")
    except Exception as e:
        print(f"Error searching {q}: {e}")
    time.sleep(2)
