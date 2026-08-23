import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Try downloading high quality Unsplash sketching and graphite pencil sets
unsplash_ids = [
    ("pencils_art_1", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_2", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_3", "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_4", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_5", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_6", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"),
    ("pencils_art_7", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80")
]

for name, u in unsplash_ids:
    try:
        time.sleep(0.3)
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        data = urllib.request.urlopen(req, context=ctx, timeout=6).read()
        out = f"scratch/{name}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
