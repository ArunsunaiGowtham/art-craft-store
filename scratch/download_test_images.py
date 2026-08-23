import urllib.request
import json

# Search Unsplash API for polymer clay & watercolor paper
urls = [
    # Sculpey Polymer clay / colorful polymer clay blocks / sculpture clay
    ("clay_blocks_1", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"),
    ("clay_blocks_2", "https://i5.walmartimages.com/seo/36-Colors-Plasticine-DIY-Plasticine-for-Children-Education-Super-Light-Clay-Air-Dry-Clay-Multi-color-Modelling-Clay-Interactive-Toy_a10541ba-c6b8-47ab-8afb-ac32595ccc03.2a212cc49013aeeeaafedff87e51fb38.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("clay_craft_3", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"),
    ("clay_pottery_4", "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80"),
    ("paper_pad_1", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"),
    ("paper_pad_2", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"),
    ("paper_pad_3", "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80")
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as response:
            data = response.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: FAILED ({e})")
