import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Search Wikimedia for graphite pencil set
url = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=graphite%20pencils%20drawing%20tin%20OR%20sketching%20pencils%20set&srnamespace=6&srlimit=10&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/4.0'})
res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
for i, item in enumerate(res.get('query', {}).get('search', [])):
    title = item['title']
    time.sleep(0.3)
    url_info = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req_info = urllib.request.Request(url_info, headers={'User-Agent': 'ArtCraftStore/4.0'})
    data = json.loads(urllib.request.urlopen(req_info, context=ctx).read().decode('utf-8'))
    for k, v in data.get('query', {}).get('pages', {}).items():
        if 'imageinfo' in v:
            u = v['imageinfo'][0]['url']
            print(f"[{i}] {title} -> {u}")
            if u.endswith('.jpg') or u.endswith('.png') or u.endswith('.jpeg'):
                try:
                    time.sleep(0.4)
                    img_data = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/4.0'}), context=ctx, timeout=8).read()
                    with open(f"scratch/graphite_set_{i}.jpg", "wb") as f:
                        f.write(img_data)
                    print(f"    Saved scratch/graphite_set_{i}.jpg ({len(img_data)} bytes)")
                except Exception as e:
                    print(f"    Failed: {e}")
