import urllib.request
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

os.makedirs('scratch/origami_wiki', exist_ok=True)
headers = {'User-Agent': 'ArtCraftStoreBot/1.0 (contact@artcraft.com)'}

api_url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=origami+photo&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|mime&format=json"
req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8', errors='ignore'))
    pages = data.get('query', {}).get('pages', {})
    for pid, pdata in pages.items():
        title = pdata.get('title', '')
        info = pdata.get('imageinfo', [{}])[0]
        url = info.get('url', '')
        mime = info.get('mime', '')
        if 'image' in mime and ('jpg' in url.lower() or 'jpeg' in url.lower() or 'png' in url.lower()):
            try:
                dest = f"scratch/origami_wiki/{os.path.basename(url)}"
                req_img = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req_img, timeout=15) as img_res:
                    img_data = img_res.read()
                    with open(dest, 'wb') as f:
                        f.write(img_data)
                    print(f"Downloaded: {os.path.basename(url)} ({len(img_data)/1024:.1f} KB)")
            except Exception as e:
                print(f"Error downloading {url}: {e}")
