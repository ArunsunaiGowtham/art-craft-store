import urllib.request

urls = [
    # Sculpey Polymer Clay options
    ("sculpey_1", "https://i5.walmartimages.com/seo/Sculpey-Premo-Polymer-Clay-Multipack-Sampler-24-Piece-Assorted-Colors-Craft-Modeling-Clay_c9ce8482-d278-43e5-8f64-4458d60dc7d8.f58bb7ba255394be5b6fa134d1bce2b4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_2", "https://i5.walmartimages.com/asr/308f2249-1662-421a-b3aa-5a3d76e73cba_1.13cba9df2bc3f41249d97825590c6fa2.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_3", "https://m.media-amazon.com/images/I/81Pj01fC-TL._AC_SL1500_.jpg"),
    ("sculpey_4", "https://i5.walmartimages.com/seo/36-Colors-Plasticine-DIY-Plasticine-for-Children-Education-Super-Light-Clay-Air-Dry-Clay-Multi-color-Modelling-Clay-Interactive-Toy_a10541ba-c6b8-47ab-8afb-ac32595ccc03.2a212cc49013aeeeaafedff87e51fb38.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_5", "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80"),
    # Arches Watercolor Pad options
    ("arches_1", "https://i5.walmartimages.com/seo/Arches-Watercolor-Paper-Pad-140-lb-Cold-Press-9-x-12-12-Sheets_d3fef1c4-1be7-466d-961f-6a97ca80fa7c.3e5dc7c9612ba200c8b0e8c89b3f71c4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("arches_2", "https://m.media-amazon.com/images/I/71P4m-u3x9L._AC_SL1500_.jpg"),
    ("arches_3", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"),
    ("arches_4", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80")
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as response:
            content_type = response.headers.get('Content-Type', '')
            data = response.read()
            print(f"{name}: SUCCESS ({len(data)} bytes, {content_type})")
            if "sculpey" in name and len(data) > 10000:
                with open(f"images/product-sculpey-premo-clay.jpg", "wb") as f:
                    f.write(data)
                print(f"Saved images/product-sculpey-premo-clay.jpg")
            if "arches_1" in name or "arches_2" in name or "arches_4" in name:
                if len(data) > 10000:
                    with open(f"images/product-arches-watercolor-paper.jpg", "wb") as f:
                        f.write(data)
                    print(f"Saved images/product-arches-watercolor-paper.jpg")
    except Exception as e:
        print(f"{name}: FAILED ({e})")
