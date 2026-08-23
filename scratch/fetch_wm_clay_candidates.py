import urllib.request
import urllib.parse
import json
import ssl
import os
import time
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ClayProductSearcher/2.0 (education_project)'}

os.makedirs('scratch/wm_clay_candidates', exist_ok=True)

queries = [
    "plasticine",
    "plastilina",
    "modeling clay",
    "modelling clay",
    "polymer clay",
    "fimo clay",
    "play dough colors",
    "air dry clay"
]

all_found = []

for q in queries:
    search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json&srlimit=15"
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            for item in results:
                title = item['title']
                info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
                req2 = urllib.request.Request(info_url, headers=headers)
                with urllib.request.urlopen(req2, timeout=10) as res2:
                    data2 = json.loads(res2.read().decode('utf-8'))
                    pages = data2.get('query', {}).get('pages', {})
                    for pid, pinfo in pages.items():
                        if 'imageinfo' in pinfo:
                            ii = pinfo['imageinfo'][0]
                            url = ii['url']
                            mime = ii.get('mime', '')
                            size = ii.get('size', 0)
                            if 'image' in mime and size > 50000 and ('jpg' in url.lower() or 'jpeg' in url.lower() or 'png' in url.lower()):
                                fname = title.replace('File:', '').replace('/', '_').replace(' ', '_')[:40] + '.jpg'
                                dest = f"scratch/wm_clay_candidates/{fname}"
                                try:
                                    req3 = urllib.request.Request(url, headers=headers)
                                    with urllib.request.urlopen(req3, timeout=15) as img_res:
                                        content = img_res.read()
                                        with open(dest, 'wb') as f:
                                            f.write(content)
                                        im = Image.open(dest)
                                        print(f"Downloaded {dest} ({im.size}, {len(content)/1024:.1f} KB) - {title}")
                                        all_found.append((dest, title, im.size))
                                except Exception as err:
                                    pass
                time.sleep(0.5)
    except Exception as e:
        print(f"Error for {q}: {e}")

print(f"\nTotal downloaded: {len(all_found)}")
