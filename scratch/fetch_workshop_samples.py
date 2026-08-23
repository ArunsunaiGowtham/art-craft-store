import urllib.request
import json
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WorkshopImageFetcher/1.0'}
os.makedirs('images/workshop_samples', exist_ok=True)

queries = [
    ("art_workshop_painting_class", "art studio workshop painting easels"),
    ("pottery_wheel_hands_sculpting", "pottery wheel clay hands ceramic studio"),
    ("origami_workshop_hands_folding", "origami paper folding workshop"),
    ("craft_workshop_artisan_macrame", "craft workshop hands macrame handmade"),
    ("oil_painting_studio_easels", "art class students painting easels")
]

for key, q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
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
                if img_url and 'image/jpeg' in mime and w >= 1200 and h >= 800:
                    filename = os.path.basename(img_url)
                    dest = f"images/workshop_samples/{key}_{filename[:40]}.jpg"
                    if not os.path.exists(dest):
                        try:
                            dl_req = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(dl_req, timeout=15) as dl_res:
                                content = dl_res.read()
                                with open(dest, 'wb') as f:
                                    f.write(content)
                                print(f"Saved {dest} ({len(content)/1024:.1f} KB, {w}x{h})")
                        except Exception as dl_err:
                            print(f"Error downloading {img_url}: {dl_err}")
    except Exception as e:
        print(f"Error searching {q}: {e}")
