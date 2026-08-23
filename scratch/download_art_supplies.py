import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Try downloading high quality direct Unsplash and CDN art craft photos
art_urls = [
    # Epoxy Resin craft kit / liquid resin with pigments
    ("resin_kit_1", "https://i5.walmartimages.com/asr/3e104e76-2f16-43f6-860a-9dca9b5059d6.c976aa3a4cfc0bf77a06dc11d1e434fe.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("resin_kit_2", "https://i5.walmartimages.com/asr/c1b52f20-db9d-434a-9efc-fa2f33f9208a.5aa3cbfdb184c8cf7eb68b354366cb4b.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    
    # 15 Piece Professional Brush Set with canvas roll/case
    ("brush_set_case_1", "https://i5.walmartimages.com/asr/72d242fb-6be9-4b68-80e2-897b5e408ec2.287bf89d1ee4a530eb7b03a74931a7c5.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("brush_set_case_2", "https://i5.walmartimages.com/asr/7680caeb-04cf-4d94-a3f1-4fc3a63ecad1.32b00511e6191c95ee13c193557e4c92.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),

    # Fabric / Textile Paint 24 bottles
    ("fabric_paints_1", "https://i5.walmartimages.com/asr/b5bfbfd2-1cbe-4c8d-8a56-da2d13778df0.74b09b5550a221f7c223c6c039775be3.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("fabric_paints_2", "https://i5.walmartimages.com/asr/cbf9cbb8-b4b7-4a0d-9b50-60b73c4f74d0.c1e95ba1a6d65427181c03cefe4be088.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),

    # Artists' Oil Colors Master Set 24 colors
    ("oil_colors_master_3", "https://i5.walmartimages.com/asr/780c108a-2c8e-49b0-97eb-828ceb432e65.0f074d283c79c8ce75be132be046a6f1.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768"),
    ("oil_colors_master_4", "https://i5.walmartimages.com/asr/71a2d54e-9d22-4ff2-8d7a-115f5d81f215.1e8ca8c8a1491cf2c42289f8125cf3be.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768")
]

for name, url in art_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        data = urllib.request.urlopen(req, context=ctx, timeout=7).read()
        out_file = f"scratch/{name}.jpg"
        with open(out_file, "wb") as f:
            f.write(data)
        print(f"{name}: SUCCESS ({len(data)} bytes)")
    except Exception as e:
        print(f"{name}: failed ({e})")
