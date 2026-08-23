import urllib.request
import urllib.parse
import re
import ssl
import json
import os
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_bing_images(query):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}&FORM=HDRSC2"
    req = urllib.request.Request(url, headers=headers)
    urls = []
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        # Bing image links have murl in JSON attributes
        murls = re.findall(r'&quot;murl&quot;:&quot;(http[^&]+)&quot;', html)
        if not murls:
            murls = re.findall(r'"murl":"(http[^"]+)"', html)
        urls = murls
    except Exception as e:
        print(f"Bing error ({query}):", e)
    return urls

os.makedirs('scratch/bing_clay_picks', exist_ok=True)

searches = [
    ("mod_clay_super_pack", "36 colors modeling clay air dry kit box white background"),
    ("air_dry_clay_pack", "air dry clay 10 pack assorted colors blocks product"),
    ("sculpey_premo_pack", "sculpey premo polymer clay sampler pack 30 colors multipack")
]

for tag, q in searches:
    print(f"\n=== Searching: {q} ===")
    found = search_bing_images(q)
    print(f"Found {len(found)} candidates")
    count = 0
    for u in found:
        if count >= 3:
            break
        dest = f"scratch/bing_clay_picks/{tag}_{count+1}.jpg"
        try:
            req_img = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(req_img, timeout=8) as resp:
                data = resp.read()
                if len(data) > 10000:
                    with open(dest, 'wb') as f:
                        f.write(data)
                    im = Image.open(dest)
                    print(f"  [{count+1}] Downloaded: {im.size} ({len(data)} bytes) -> {u[:70]}")
                    count += 1
        except Exception as e:
            # print(f"  Download error: {e}")
            pass
