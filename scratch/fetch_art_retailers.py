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

os.makedirs('scratch/test_art_retailers', exist_ok=True)

# Direct product CDN images from art supply brands (Crayola, Sculpey, Koh-I-Noor, Staedtler, Michaels, etc.)
urls = [
    # Modeling Clay 36 Colors / Plasticine sets
    ("mod_clay_crayola", "https://images-na.ssl-images-amazon.com/images/I/81Pj01fC-TL.jpg"),
    ("mod_clay_sargent", "https://images-na.ssl-images-amazon.com/images/I/81k3yUj-TPL.jpg"),
    ("mod_clay_jovi", "https://images-na.ssl-images-amazon.com/images/I/81J4U4RzPCL.jpg"),
    ("mod_clay_stationers", "https://stationers.pk/cdn/shop/products/clay-set.jpg?v=1678871737&width=1000"),
    
    # Air Dry Clay Assorted Colors / 10-Pack
    ("air_dry_das", "https://images-na.ssl-images-amazon.com/images/I/71Q3JkC85sL.jpg"),
    ("air_dry_crayola", "https://images-na.ssl-images-amazon.com/images/I/81tB%2BRV7rEL.jpg"),
    ("air_dry_montmarte", "https://images-na.ssl-images-amazon.com/images/I/71d1gR76xGL.jpg"),
    ("air_dry_craftsmart", "https://imgs.michaels.com/MAM/assets/1/5E3C120100E548A19614488A01A034C7/img/9B829285098C496180370DC0BB6C6D68/10542385_1.jpg"),

    # Polymer Clay Sculpey Premo / III Multipack
    ("sculpey_sampler_30", "https://images-na.ssl-images-amazon.com/images/I/81eRk2eQ-kL.jpg"),
    ("sculpey_premo_24", "https://images-na.ssl-images-amazon.com/images/I/71T1pYlJqSL.jpg"),
    ("sculpey_premo_30", "https://images-na.ssl-images-amazon.com/images/I/81Xm-v0jKxL.jpg"),
    ("fimo_soft_pack", "https://images-na.ssl-images-amazon.com/images/I/71P4m-u3x9L.jpg")
]

for name, url in urls:
    dest = f"scratch/test_art_retailers/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            if len(data) > 5000:
                with open(dest, 'wb') as f:
                    f.write(data)
                im = Image.open(dest)
                print(f"SUCCESS {name}: {im.size} ({os.path.getsize(dest)} bytes)")
            else:
                print(f"TOO SMALL {name}: {len(data)} bytes")
    except Exception as e:
        print(f"FAILED {name}: {e}")
