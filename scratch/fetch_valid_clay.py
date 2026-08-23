import urllib.request
import ssl
import json
import os
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

os.makedirs('scratch/test_valid_clay', exist_ok=True)

# Curated list of live e-commerce product image URLs for art clays
urls = [
    # 1. 36 Colors Modeling Clay Super Pack
    ("modeling_36_colors_1", "https://i5.walmartimages.com/seo/36-Colors-Air-Dry-Clay-Ultra-Light-Magic-Clay-Soft-Stretchy-Modeling-Clay-with-Sculpting-Tools-Animal-Accessories-Safe-Non-Toxic-Craft-Kits-Gifts-for-K_3c178be3-611a-4d76-8095-236b3ba9fbe2.fa9bceb545d909eeaeaa6a6552a8df80.jpeg"),
    ("modeling_36_colors_2", "https://i5.walmartimages.com/asr/3fa6972e-d007-4224-814d-fa7d5f0426f8.1df6e104e1329c36203cf65d4b528f11.jpeg"),
    ("modeling_36_colors_3", "https://i5.walmartimages.com/asr/75c04e22-80ba-4700-aa1e-ee2ee59faeb1.2e2a39281a8b9eb9a68a6fcf777e3aa0.jpeg"),
    ("modeling_36_colors_4", "https://i5.walmartimages.com/asr/6b1da1d8-8e6c-4876-90e6-1262dcfd4850.3a2417ec637ff036573df26720f4c3a2.jpeg"),
    
    # 2. Polymer Clay Sampler Pack
    ("sculpey_sampler_1", "https://i5.walmartimages.com/asr/e2b4d909-5c12-4c28-bb4a-0a7cae292d3b.d8b8e053f3e2b27464971ae4125b29b4.jpeg"),
    ("sculpey_sampler_2", "https://i5.walmartimages.com/asr/308f2249-1662-421a-b3aa-5a3d76e73cba_1.13cba9df2bc3f41249d97825590c6fa2.jpeg"),
    ("sculpey_sampler_3", "https://i5.walmartimages.com/asr/e1dfd4be-c8ff-4bf4-bb33-5c546db9a8e0.c9a92911bc1cf9be276f7a635ae4ceb5.jpeg"),
    ("sculpey_sampler_4", "https://i5.walmartimages.com/asr/81eb7f0e-d7f4-4df8-8bb3-5858cfd3d75c.f61536b9e28f1181f3ad5973fc0bead8.jpeg"),
    
    # 3. Air dry clay pack
    ("air_dry_clay_1", "https://i5.walmartimages.com/asr/f6f61cf3-dc2c-4fec-a130-4b239e68039b.50a0cb4f5dbea7a7d4a32c3c57289439.jpeg"),
    ("air_dry_clay_2", "https://i5.walmartimages.com/asr/3c7f394c-81ba-4475-ae90-c0529d6b5e02.58e5a6bfcf2546a1e355c276b90757fa.jpeg")
]

for name, url in urls:
    dest = f"scratch/test_valid_clay/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"SUCCESS {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"FAILED {name}: {e}")
