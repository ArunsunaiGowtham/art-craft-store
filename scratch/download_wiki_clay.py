import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

wiki_urls = [
    ("polymer_clay_examples", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Polymer_clay_examples.jpg/1280px-Polymer_clay_examples.jpg"),
    ("polymer_clay_conditioning", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Polymer_clay_conditioning.jpg/1280px-Polymer_clay_conditioning.jpg"),
    ("pates_autodurcissantes", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Pates-autodurcissantes.jpg/1280px-Pates-autodurcissantes.jpg"),
    ("polymer_clay_2011_3", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Polymer-clay-2011-3.jpg/1280px-Polymer-clay-2011-3.jpg"),
    ("polymer_clay_2011_13", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Polymer-clay-201113.jpg/1280px-Polymer-clay-201113.jpg")
]

for name, url in wiki_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraftStoreBot/1.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
