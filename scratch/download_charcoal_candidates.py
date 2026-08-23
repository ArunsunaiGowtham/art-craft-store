import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# High quality Unsplash and art CDN product photos for charcoal and sketching sets
urls = [
    ("charcoal_1", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_2", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_3", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_4", "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_5", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_6", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_7", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"),
    ("charcoal_8", "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=800&q=80")
]

for name, u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        data = urllib.request.urlopen(req, context=ctx, timeout=6).read()
        out = f"scratch/{name}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
