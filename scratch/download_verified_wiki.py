import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("acrylfarbset", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Acrylfarbset.jpg/1280px-Acrylfarbset.jpg"),
    ("golden_acrylic", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/GoldenAcrylicColors.jpg/1280px-GoldenAcrylicColors.jpg"),
    ("love_of_calligraphy", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Love_of_calligraphy_%28Unsplash%29.jpg/1280px-Love_of_calligraphy_%28Unsplash%29.jpg")
]

for name, u in urls:
    try:
        time.sleep(1)
        req = urllib.request.Request(u, headers={'User-Agent': 'ArtCraftWebStore/2.0 (contact@artcraft.com)'})
        data = urllib.request.urlopen(req, context=ctx, timeout=10).read()
        with open(f"scratch/{name}.jpg", "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
