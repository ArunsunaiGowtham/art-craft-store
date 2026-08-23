import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://en.wikipedia.org/w/api.php?action=query&titles=Charcoal_(art)&generator=images&gimlimit=20&prop=imageinfo&iiprop=url&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/3.0'})
data = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
pages = data.get('query', {}).get('pages', {})
for k, v in pages.items():
    if 'imageinfo' in v and len(v['imageinfo']) > 0:
        title = v['title']
        u = v['imageinfo'][0]['url']
        print(f"{title} -> {u}")
        if u.endswith('.jpg') or u.endswith('.png') or u.endswith('.jpeg'):
            try:
                time.sleep(0.5)
                req_img = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/3.0'})
                img_data = urllib.request.urlopen(req_img, context=ctx, timeout=8).read()
                clean_name = title.replace('File:', '').replace(' ', '_')[:30]
                out_path = f"scratch/charcoal_art_{clean_name}.jpg"
                with open(out_path, "wb") as f:
                    f.write(img_data)
                print(f"  Saved {out_path} ({len(img_data)} bytes)")
            except Exception as e:
                print(f"  Failed: {e}")
