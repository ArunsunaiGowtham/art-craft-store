import urllib.request
import json
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WorkshopDL/1.0'}

queries = ["potter wheel hands shaping clay", "pottery workshop ceramic studio class"]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, info in pages.items():
                img_info = info.get('imageinfo', [{}])[0]
                img_url = img_info.get('url')
                mime = img_info.get('mime', '')
                w = img_info.get('width', 0)
                h = img_info.get('height', 0)
                if img_url and 'image/jpeg' in mime and w >= 1200:
                    filename = os.path.basename(img_url)
                    dest = f"images/workshop_samples/pottery_{filename[:30]}.jpg"
                    if not os.path.exists(dest):
                        try:
                            dl_req = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(dl_req, timeout=15) as dl_res:
                                content = dl_res.read()
                                with open(dest, 'wb') as f:
                                    f.write(content)
                                print(f"Saved {dest} ({len(content)/1024:.1f} KB, {w}x{h})")
                        except Exception as e:
                            print(f"Error {dest}: {e}")
    except Exception as e:
        print(f"Error search {q}: {e}")
