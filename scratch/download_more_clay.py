import urllib.request

clay_urls = [
    # Sculpey Premo / Polymer clay sets
    ("sculpey_pack_1", "https://i5.walmartimages.com/seo/Sculpey-Premo-Polymer-Clay-Sampler-Pack-24-Colors-1oz-Bars_8065bfa7-3211-42e5-bc09-0d3215886618.jpg"),
    ("sculpey_pack_2", "https://stationers.pk/cdn/shop/products/61qJmUvK64L._AC_SL1500.jpg"),
    ("sculpey_pack_3", "https://i5.walmartimages.com/asr/e2b4d909-5c12-4c28-bb4a-0a7cae292d3b.d8b8e053f3e2b27464971ae4125b29b4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_pack_4", "https://i5.walmartimages.com/asr/3e721d01-e945-4209-847e-2cf1fba502ee.09df8c8a14b0b1cb3bcfb7fb25f0e340.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_pack_5", "https://i5.walmartimages.com/asr/e09e1f82-a080-4ecb-99f5-7c088a29aeb6.b6a22c53a77673551532f896b539a5f4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_pack_6", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_pack_7", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80")
]

for name, url in clay_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = response.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
