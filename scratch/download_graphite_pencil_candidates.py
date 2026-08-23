import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = [
    ("spec_artists_pencils", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Speciality_artists_pencils_051907.jpg/1280px-Speciality_artists_pencils_051907.jpg"),
    ("blackwing_box", "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Palomino_Blackwing_602_pencils.jpg/1280px-Palomino_Blackwing_602_pencils.jpg"),
    ("unsplash_pencils_1", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"),
    ("unsplash_pencils_2", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"),
    ("unsplash_pencils_3", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80")
]

for name, u in candidates:
    try:
        time.sleep(0.5)
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
        out = f"scratch/{name}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
