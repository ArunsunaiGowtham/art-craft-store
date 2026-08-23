import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

targets = [
    ("charcoal_pencils", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Charcoal_pencils_051907.jpg/1280px-Charcoal_pencils_051907.jpg"),
    ("charcoal_sticks", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Charcoal_sticks_051907.jpg/1280px-Charcoal_sticks_051907.jpg"),
    ("fusain_box", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Fusain.JPG/1280px-Fusain.JPG")
]

for name, u in targets:
    try:
        time.sleep(0.5)
        req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/3.0'})
        data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
        out = f"scratch/{name}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
