import urllib.request
import json
import os
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context
os.makedirs('scratch/origami_wiki', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

api_url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=origami+crane+or+dragon+or+kusudama&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime&format=json"
req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8', errors='ignore'))
    pages = data.get('query', {}).get('pages', {})
    count = 0
    for pid, pdata in pages.items():
        title = pdata.get('title', '')
        info = pdata.get('imageinfo', [{}])[0]
        url = info.get('url', '')
        mime = info.get('mime', '')
        if 'image' in mime and ('jpg' in url.lower() or 'jpeg' in url.lower() or 'png' in url.lower()):
            count += 1
            dest = f"scratch/origami_wiki/origami_sample_{count}.jpg"
            try:
                req_img = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req_img, timeout=15) as img_res:
                    img_data = img_res.read()
                    with open(dest, 'wb') as f:
                        f.write(img_data)
                    print(f"Downloaded sample {count} ({len(img_data)/1024:.1f} KB): {dest}")
            except Exception as e:
                print(f"Error {count}: {e}")
