import urllib.request
import urllib.parse
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtCraftStore/1.0 (test@artcraft.com)'}

titles = [
    "File:Kusudama.jpg",
    "File:Origami kusudama.jpg",
    "File:Origami flower.jpg",
    "File:Origami lotus.jpg",
    "File:Origami-crane.jpg",
    "File:Paper crane.jpg",
    "File:Origami rose.jpg",
    "File:Origami polyhedra.jpg",
    "File:Modular origami polyhedra.jpg"
]

for i, t in enumerate(titles):
    query_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(query_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata:
                    url = pdata['imageinfo'][0]['url']
                    dest = f"images/origami_samples/kusudama_{i+1}.jpg"
                    req_img = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req_img, timeout=15) as img_res:
                        img_data = img_res.read()
                        with open(dest, 'wb') as f:
                            f.write(img_data)
                        print(f"Saved {dest} ({len(img_data)/1024:.1f} KB) from {t}")
    except Exception as e:
        print(f"Error {t}: {e}")
