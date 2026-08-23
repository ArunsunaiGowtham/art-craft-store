import urllib.request
import ssl
import os
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

os.makedirs('scratch/test_unsplash_art', exist_ok=True)

photo_ids = [
    ("clay_pottery_studio_1", "1565193566173-7a0ee3dbe261"),
    ("clay_hands_pottery_2", "1578749556568-bc2c40e68b61"),
    ("colorful_dough_blocks_3", "1500462918059-b1a0cb512f1d"),
    ("colorful_palette_craft_4", "1513364776144-60967b0f800f"),
    ("craft_materials_6", "1596548438137-d51ea5c83ca5"),
    ("crafting_supplies_colors_7", "1584992236310-6edddc08acff"),
    ("creative_colors_8", "1541701494587-cb58502866ab"),
    ("craft_workshop_tools_9", "1581783342308-f792dbdd27c5"),
    ("colorful_markers_pencils_10", "1583485088034-697b5bc54ccd"),
    ("ceramic_sculpture_glaze_11", "1615486511484-92e172cc4fe0"),
    ("craft_clay_hands_12", "1590736969955-71cc94801759")
]

for name, pid in photo_ids:
    url = f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w=800&q=80"
    dest = f"scratch/test_unsplash_art/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"OK {name}: {im.size} ({len(data)} bytes)")
    except Exception as e:
        print(f"FAIL {name}: {e}")
