import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

targets = [
    ("oil_tubes_colors", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Various_colors_of_oil_paint_tubes_1.jpg/1280px-Various_colors_of_oil_paint_tubes_1.jpg"),
    ("painting_brushes", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Painting_brushes.jpg/1280px-Painting_brushes.jpg"),
    ("paintbrushes_set", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Paintbrushes.jpg/1280px-Paintbrushes.jpg")
]

for name, u in targets:
    try:
        time.sleep(1)
        req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftStore/2.0 (contact@artcraft.com)'})
        data = urllib.request.urlopen(req, context=ctx, timeout=10).read()
        out = f"scratch/{name}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
