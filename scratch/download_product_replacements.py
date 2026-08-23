import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = [
    # 1. Acrylic paint tubes (Product #2)
    ("acrylic_tubes_1", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"),
    ("acrylic_tubes_2", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"),
    ("acrylic_tubes_3", "https://i5.walmartimages.com/asr/3fa6972e-d007-4224-814d-fa7d5f0426f8.1df6e104e1329c36203cf65d4b528f11.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    
    # 2. Calligraphy pen set with nibs & ink (Product #16)
    ("calligraphy_set_1", "https://images.unsplash.com/photo-1585336261026-7f0eb9e3b977?auto=format&fit=crop&w=600&q=80"),
    ("calligraphy_set_2", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"),
    ("calligraphy_set_3", "https://i5.walmartimages.com/asr/e1dfd4be-c8ff-4bf4-bb33-5c546db9a8e0.c9a92911bc1cf9be276f7a635ae4ceb5.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    
    # 3. Professional artist paint brush set (Product #20)
    ("brush_set_1", "https://i5.walmartimages.com/asr/6b1da1d8-8e6c-4876-90e6-1262dcfd4850.3a2417ec637ff036573df26720f4c3a2.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("brush_set_2", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"),
    
    # 4. Wooden Studio Painting Easel (Product #21)
    ("easel_1", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"),
    ("easel_2", "https://i5.walmartimages.com/asr/81eb7f0e-d7f4-4df8-8bb3-5858cfd3d75c.f61536b9e28f1181f3ad5973fc0bead8.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    
    # 5. Fabric / Textile paint set (Product #28)
    ("fabric_paint_1", "https://i5.walmartimages.com/asr/3c7f394c-81ba-4475-ae90-c0529d6b5e02.58e5a6bfcf2546a1e355c276b90757fa.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("fabric_paint_2", "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=600&q=80"),

    # 6. Wooden Mixing Palette & Brushes (Product #29)
    ("palette_1", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"),
    ("palette_2", "https://i5.walmartimages.com/asr/75c04e22-80ba-4700-aa1e-ee2ee59faeb1.2e2a39281a8b9eb9a68a6fcf777e3aa0.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    
    # 7. Artists' Oil Color Master Set 24 colors (Product #33)
    ("oil_colors_master_1", "https://i5.walmartimages.com/asr/e2b4d909-5c12-4c28-bb4a-0a7cae292d3b.d8b8e053f3e2b27464971ae4125b29b4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("oil_colors_master_2", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80")
]

for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, context=ctx, timeout=6) as resp:
            data = resp.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
