import urllib.request
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraftStore/1.0'}
os.makedirs('images/workshop_samples', exist_ok=True)

# Curated Unsplash photos for workshops
targets = [
    # Art studio workshop with easels & painting
    ("ws_art_studio_class", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"),
    # Pottery wheel hands shaping clay workshop
    ("ws_pottery_wheel_hands", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"),
    # Ceramic clay pottery workshop studio
    ("ws_ceramics_studio_pottery", "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"),
    # Crafting / macrame workshop
    ("ws_crafting_hands_table", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80"),
    # In-studio art workshop students painting
    ("ws_painting_studio_easel_group", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80")
]

for name, url in targets:
    dest = f"images/workshop_samples/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            c = res.read()
            with open(dest, 'wb') as f:
                f.write(c)
            print(f"Downloaded {dest}: {len(c)/1024:.1f} KB")
    except Exception as e:
        print(f"Failed {name}: {e}")
