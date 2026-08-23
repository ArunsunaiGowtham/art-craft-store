import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Textile%20paint%20OR%20Fabric%20paint&srnamespace=6&srlimit=8&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/2.0'})
res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
for i, item in enumerate(res.get('query', {}).get('search', [])):
    title = item['title']
    time.sleep(0.5)
    url_info = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req_info = urllib.request.Request(url_info, headers={'User-Agent': 'ArtCraftStore/2.0'})
    data = json.loads(urllib.request.urlopen(req_info, context=ctx).read().decode('utf-8'))
    for k, v in data.get('query', {}).get('pages', {}).items():
        if 'imageinfo' in v:
            u = v['imageinfo'][0]['url']
            if u.endswith('.jpg') or u.endswith('.png'):
                try:
                    time.sleep(0.5)
                    img_data = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/2.0'}), context=ctx).read()
                    with open(f"scratch/fabric_candidate_{i}.jpg", "wb") as f:
                        f.write(img_data)
                    print(f"Saved scratch/fabric_candidate_{i}.jpg from {title}")
                except Exception as e:
                    print(f"Failed {title}: {e}")
