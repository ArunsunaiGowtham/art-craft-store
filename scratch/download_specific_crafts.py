import urllib.request
import urllib.parse
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtStoreCraftFetcher/1.0 (contact@artcraft.org)'}

titles = [
    "File:Linocut print of a fish.jpg",
    "File:Linocut tools.jpg",
    "File:Linocut printing process.jpg",
    "File:Linocut printmaking studio.jpg",
    "File:Handmade pottery on display.jpg",
    "File:Ceramic pottery mugs.jpg",
    "File:Stained glass suncatcher.jpg",
    "File:Stained glass window craft.jpg",
    "File:Embroidery hoop with floral design.jpg",
    "File:Macrame wall hanging on wooden dowel.jpg"
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
                    dest = f"images/crafting_samples/craft_test_{i+1}.jpg"
                    req_img = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req_img, timeout=15) as img_res:
                        img_data = img_res.read()
                        with open(dest, 'wb') as f:
                            f.write(img_data)
                        print(f"Saved {dest} ({len(img_data)/1024:.1f} KB) from {t}")
    except Exception as e:
        print(f"Error {t}: {e}")
