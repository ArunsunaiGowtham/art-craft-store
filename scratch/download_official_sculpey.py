import urllib.request
import json

urls = [
    # Dickblick / Art supply direct CDN images for Sculpey Polymer Clay
    ("blick_sculpey_1", "https://cdn.dick-blick.com/items/332/17/33217-1024-1-3ww-l.jpg"),
    ("blick_sculpey_2", "https://cdn.dick-blick.com/items/332/17/33217-1012-1-3ww-l.jpg"),
    ("blick_sculpey_3", "https://cdn.dick-blick.com/items/332/14/33214-1024-1-3ww-l.jpg"),
    ("sculpey_official_1", "https://sculpey.com/cdn/shop/files/PE24-Sampler-Box-Front_2048x.jpg"),
    ("sculpey_official_2", "https://sculpey.com/cdn/shop/products/PE24_front_1024x1024.jpg"),
    ("sculpey_official_3", "https://sculpey.com/cdn/shop/products/S330_front_1024x1024.jpg"),
    ("sculpey_official_4", "https://sculpey.com/cdn/shop/files/S330-Sampler-Front-Flat_1024x1024.jpg"),
    ("sculpey_official_5", "https://sculpey.com/cdn/shop/products/PE24_clay_1024x1024.jpg"),
    # Artshed online polymer clay
    ("artshed_clay_1", "https://www.artshedonline.com.au/assets/full/PE24.jpg"),
    ("artshed_clay_2", "https://www.artshedonline.com.au/assets/full/S330.jpg")
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = resp.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
