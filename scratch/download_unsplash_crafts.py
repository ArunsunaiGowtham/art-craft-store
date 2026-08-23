import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
os.makedirs('images/crafting_samples', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# High-resolution Unsplash craft photography IDs:
# 1. Macrame & woven fiber art: photo-1584589167171-541ce45f1eea or photo-1606760227091-3dd870d97f1d
# 2. Handcrafted ceramic / pottery: photo-1565193566173-7a0ee3dbe261
# 3. Botanical resin / floral preservation craft: photo-1579783902614-a3fb3927b675
# 4. Embroidery craft hoop: photo-1617050318658-a9a3175e34cb or photo-1508873696983-2df5293cb32b

urls = {
    "macrame_wall_hanging.jpg": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&h=900&q=85",
    "macrame_boho_craft.jpg": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&h=900&q=85",
    "embroidery_hoop_craft.jpg": "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=1200&h=900&q=85",
    "resin_botanical_craft.jpg": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&h=900&q=85",
    "leather_craft_tools.jpg": "https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=1200&h=900&q=85"
}

for filename, url in urls.items():
    dest = os.path.join('images/crafting_samples', filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            with open(dest, 'wb') as f:
                f.write(res.read())
            print(f"Downloaded {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
    except Exception as e:
        print(f"Error {filename}: {e}")
