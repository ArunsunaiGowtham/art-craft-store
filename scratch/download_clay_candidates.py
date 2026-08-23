import urllib.request
import os
import ssl
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = {
    # 1. Modeling Clay Sets
    "mod_1": "https://m.media-amazon.com/images/I/81xU217vQhL._AC_SL1500_.jpg",
    "mod_2": "https://m.media-amazon.com/images/I/71YyQ2j8LNL._AC_SL1500_.jpg",
    "mod_3": "https://m.media-amazon.com/images/I/81Q1yO0oE2L._AC_SL1500_.jpg",
    "mod_4": "https://i5.walmartimages.com/asr/c735dfbd-b657-4183-b78f-efeaec51a24d.25a0a996dc80fb785bc0aa8243be44b5.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "mod_5": "https://i5.walmartimages.com/asr/3e721d01-e945-4209-847e-2cf1fba502ee.09df8c8a14b0b1cb3bcfb7fb25f0e340.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    
    # 2. Air Dry Clay Packs (10-pack / multi-color / natural clay blocks)
    "air_1": "https://m.media-amazon.com/images/I/81yq+eZ-5xL._AC_SL1500_.jpg",
    "air_2": "https://m.media-amazon.com/images/I/71I2oP+v7IL._AC_SL1500_.jpg",
    "air_3": "https://m.media-amazon.com/images/I/716Z2kIu3UL._AC_SL1500_.jpg",
    "air_4": "https://i5.walmartimages.com/asr/c2d76bc7-86c3-4217-beea-68ae2fec3bbd.95b937c569f1a0e19a4e8d264789fa43.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "air_5": "https://i5.walmartimages.com/asr/e2b4d909-5c12-4c28-bb4a-0a7cae292d3b.d8b8e053f3e2b27464971ae4125b29b4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    
    # 3. Sculpey Premo / Polymer Clay Multipack
    "poly_1": "https://m.media-amazon.com/images/I/81Pj01fC-TL._AC_SL1500_.jpg",
    "poly_2": "https://m.media-amazon.com/images/I/81P1T-9o9NL._AC_SL1500_.jpg",
    "poly_3": "https://i5.walmartimages.com/asr/308f2249-1662-421a-b3aa-5a3d76e73cba_1.13cba9df2bc3f41249d97825590c6fa2.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "poly_4": "https://i5.walmartimages.com/asr/e09e1f82-a080-4ecb-99f5-7c088a29aeb6.b6a22c53a77673551532f896b539a5f4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "poly_5": "https://i5.walmartimages.com/seo/Sculpey-Premo-Polymer-Clay-Sampler-Pack-24-Colors-1oz-Bars_8065bfa7-3211-42e5-bc09-0d3215886618.jpg"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

os.makedirs('scratch/clay_test', exist_ok=True)

for k, url in candidates.items():
    dest = f"scratch/clay_test/{k}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as res:
            data = res.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"SUCCESS: {k} -> {im.size}, {len(data)} bytes")
    except Exception as e:
        print(f"FAILED: {k} ({e})")
