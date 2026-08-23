import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("artshed_pe24", "https://www.artshedonline.com.au/assets/full/PE24.jpg"),
    ("artshed_s330", "https://www.artshedonline.com.au/assets/full/S330.jpg"),
    ("artshed_pe12", "https://www.artshedonline.com.au/assets/full/PE12.jpg"),
    ("stationers_clay_1", "https://stationers.pk/cdn/shop/products/61qJmUvK64L._AC_SL1500.jpg"),
    ("stationers_clay_2", "https://stationers.pk/cdn/shop/products/71v1QW6X9tL._AC_SL1500.jpg"),
    ("rung_clay_1", "https://rung.com.pk/cdn/shop/products/PE24_Clay_Sampler.jpg"),
    ("polymer_clay_super", "https://i5.walmartimages.com/seo/36-Colors-Plasticine-DIY-Plasticine-for-Children-Education-Super-Light-Clay-Air-Dry-Clay-Multi-color-Modelling-Clay-Interactive-Toy_a10541ba-c6b8-47ab-8afb-ac32595ccc03.2a212cc49013aeeeaafedff87e51fb38.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("polymer_clay_blocks", "https://scoopi.com.au/cdn/shop/files/9_c1e28423-1a97-49b1-90c9-1e2eb904c05a_700x700.png?v=1747271922")
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
