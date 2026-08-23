import urllib.request
import urllib.parse
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtStoreCraftFetcher/1.0 (contact@artcraft.org)'}

queries = [
    "macrame",
    "linocut print",
    "handmade soap",
    "embroidery hoop",
    "leather craft",
    "stained glass mosaic"
]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                title = pdata.get('title', '')
                info = pdata.get('imageinfo', [{}])[0]
                img_url = info.get('url', '')
                mime = info.get('mime', '')
                if 'image' in mime and ('jpg' in img_url.lower() or 'jpeg' in img_url.lower() or 'png' in img_url.lower()):
                    safe_name = "".join(c for c in title if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:40]
                    dest = f"images/crafting_samples/{safe_name}.jpg"
                    try:
                        req_img = urllib.request.Request(img_url, headers=headers)
                        with urllib.request.urlopen(req_img, timeout=15) as img_res:
                            with open(dest, 'wb') as f:
                                f.write(img_res.read())
                            print(f"Downloaded {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
                    except Exception as e:
                        print(f"Error downloading {title}: {e}")
    except Exception as e:
        print(f"Error {q}: {e}")
