import urllib.request
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

# High quality Unsplash craft photos:
# 1. Macrame / fiber art: photo-1528458988636-69675276e053 (macrame plant hanger) / photo-1533090161767-e6ffed986c88 / photo-1513519245088-0e12902e5a38
# 2. Pottery wheel throwing: photo-1565193566173-7a0ee3dbe261 / photo-1493106819501-66d381c466f1
# 3. Resin art / craft: photo-1513364776144-60967b0f800f
# 4. Glass mosaic / stained glass: photo-1579783900882-c0d3dad7b119
# 5. Wood carving / craft: photo-1588854337221-4cf9fa96059c

photo_ids = [
    ("macrame_plant_hanger", "photo-1528458988636-69675276e053"),
    ("boho_macrame_art", "photo-1533090161767-e6ffed986c88"),
    ("weaving_fiber_craft", "photo-1513519245088-0e12902e5a38"),
    ("pottery_wheel_craft", "photo-1565193566173-7a0ee3dbe261"),
    ("pottery_hands", "photo-1493106819501-66d381c466f1"),
    ("leather_wood_craft", "photo-1588854337221-4cf9fa96059c")
]

for name, pid in photo_ids:
    url = f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w=1200&h=900&q=85"
    dest = f"images/crafting_samples/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            with open(dest, 'wb') as f:
                f.write(res.read())
            print(f"Downloaded {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
    except Exception as e:
        print(f"Error {name}: {e}")
