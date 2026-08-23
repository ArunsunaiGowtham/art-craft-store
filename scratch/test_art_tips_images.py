import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtCraft/1.0'}

queries = [
    ("color_wheel", "https://upload.wikimedia.org/wikipedia/commons/3/38/BYR_color_wheel.svg"),
    ("itten_wheel", "https://upload.wikimedia.org/wikipedia/commons/2/2a/Farbkreis_Itten_1961.png"),
    ("palette_brushes", "https://upload.wikimedia.org/wikipedia/commons/1/15/Artist_palette_with_paintbrushes.jpg"),
    ("palette_acrylic", "https://upload.wikimedia.org/wikipedia/commons/a/ae/Wooden_palette.jpg"),
    ("studio_brushes", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"),
    ("color_mixing", "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80")
]

for name, u in queries:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            data = r.read()
            print(f"OK ({r.status}): {name} -> {len(data)} bytes")
            if len(data) > 1000:
                with open(f"scratch/{name}.jpg", "wb") as f:
                    f.write(data)
                print(f"Saved scratch/{name}.jpg")
    except Exception as e:
        print(f"FAILED {name}: {e}")
    time.sleep(0.5)
