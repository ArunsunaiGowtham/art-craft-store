import urllib.request
import json
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

candidates = {
    "clay_set_1": "https://i5.walmartimages.com/seo/36-Colors-Air-Dry-Clay-Ultra-Light-Magic-Clay-Soft-Stretchy-Modeling-Clay-with-Sculpting-Tools-Animal-Accessories-Safe-Non-Toxic-Craft-Kits-Gifts-for-K_3c178be3-611a-4d76-8095-236b3ba9fbe2.fa9bceb545d909eeaeaa6a6552a8df80.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "clay_set_2": "https://i5.walmartimages.com/seo/Modeling-Clay-Air-Dry-Clay-36-Colors-Soft-Ultra-Light-Magic-Clay-with-3-Clay-Tools-DIY-Molding-Clay-Craft-Kit-Gifts-for-Kids-Boys-Girls-Age-3-12-Year-O_b49ff5bc-17cf-4357-9d72-005fae3e9d89.aa1ee814138e68cfb99db1dff64bf54c.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    "clay_set_3": "https://i5.walmartimages.com/seo/36-Colors-Modeling-Clay-Air-Dry-Magic-Clay-Soft-Ultra-Light-DIY-Molding-Clay-with-3-Sculpting-Tools-Safe-Non-Toxic-Craft-Kit-Art-Gifts-for-Kids-Boys-Gir_a7fe42c2-8356-42d4-bb0a-81079d34eb51.ae1987515b13ea3a7ce1c5fbda0a9058.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"
}

os.makedirs('scratch/test_walmart_clay', exist_ok=True)

for name, url in candidates.items():
    dest = f"scratch/test_walmart_clay/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as r:
            with open(dest, 'wb') as f:
                f.write(r.read())
        im = Image.open(dest)
        print(f"Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
