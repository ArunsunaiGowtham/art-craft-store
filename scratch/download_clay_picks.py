import urllib.request
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

os.makedirs('scratch/clay_picks', exist_ok=True)

picks = [
    # 1. 36-color / 24-color modeling clay pack:
    ("modeling_clay_1", "https://i5.walmartimages.com/asr/3fa47d48-cb58-4560-a2ea-9c04fe7542d9.2df037f074d284a1e95c1c8a6dc50bf6.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("modeling_clay_2", "https://i5.walmartimages.com/asr/c1a634ee-876b-4e89-8d76-d3527aa14eb9.ca6c7aeaf9ce4bbbe4ba535e69e38e15.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("modeling_clay_3", "https://i5.walmartimages.com/asr/24cba438-f9b8-4d57-b088-99933cfba342.a1f1dc2144709fdf83f2dcce16499878.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    
    # 2. Air dry clay assorted colors:
    ("air_dry_1", "https://i5.walmartimages.com/asr/c8bb03b9-1d90-4c3e-868d-294d1a3c79be.d408ba1c3f15b8cf0f23cb5c102a0a2f.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("air_dry_2", "https://i5.walmartimages.com/asr/22bc58a0-2f3b-4861-9da7-76798086057d.c9bebbecba8faecf8d95e0c5c3e031eb.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    
    # 3. Sculpey Premo polymer clay multipack:
    ("sculpey_1", "https://i5.walmartimages.com/asr/1472cae3-f09b-4ff4-bf9a-efadfa266f80.12658826d9539343ef5cb02f43339029.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("sculpey_2", "https://i5.walmartimages.com/asr/4ff336cf-82e7-4581-80cf-f2d4eeadbe51.daef1bbd43714b1b369c2d1dd2cf9bfa.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768")
]

for name, url in picks:
    dest = f"scratch/clay_picks/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"✅ {name}: {im.size}, {len(data)} bytes")
    except Exception as e:
        print(f"❌ {name}: {e}")
