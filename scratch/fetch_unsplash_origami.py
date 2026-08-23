import urllib.request
import json
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) OrigamiDL/1.0'}
os.makedirs('images/origami_samples', exist_ok=True)

# Test Unsplash photo candidates with origami / paper folding keywords
unsplash_ids = [
    ("origami_cranes_pastel", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"),
    ("origami_colors", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
    ("origami_geometry_1", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"),
    ("origami_paper_plane", "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80"),
    ("origami_craft_flatlay", "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80")
]

for name, url in unsplash_ids:
    dest = f"images/origami_samples/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            c = res.read()
            with open(dest, 'wb') as f:
                f.write(c)
            print(f"Downloaded {dest}: {len(c)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
