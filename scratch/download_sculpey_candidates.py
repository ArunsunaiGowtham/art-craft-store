import urllib.request

clay_candidates = [
    # Sculpey Premo / Oven-bake polymer clay blocks / colorful clay sampler
    ("sculpey_sampler_1", "https://i5.walmartimages.com/asr/308f2249-1662-421a-b3aa-5a3d76e73cba_1.13cba9df2bc3f41249d97825590c6fa2.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_sampler_2", "https://images-na.ssl-images-amazon.com/images/I/81Pj01fC-TL.jpg"),
    ("sculpey_sampler_3", "https://images-na.ssl-images-amazon.com/images/I/71N1C6bL7IL.jpg"),
    ("sculpey_sampler_4", "https://images-na.ssl-images-amazon.com/images/I/71qS6FvFkNL.jpg"),
    ("sculpey_sampler_5", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_sampler_6", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_sampler_7", "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_sampler_8", "https://images.unsplash.com/photo-1615800001880-d40c4f74d084?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_sampler_9", "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80"),
    ("sculpey_sampler_10", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80")
]

for name, url in clay_candidates:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=6) as response:
            data = response.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: FAILED ({e})")
