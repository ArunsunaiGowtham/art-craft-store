import urllib.request
import ssl
import os
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

os.makedirs('scratch/test_curated_clay', exist_ok=True)

# Curated high-resolution Unsplash photo IDs and art supply images
test_list = [
    # Colorful craft / clay / sculpting
    ("unsplash_clay_1", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_2", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_3", "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_4", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_5", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_6", "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_7", "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_8", "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_9", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_10", "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_11", "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_12", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_13", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_14", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"),
    ("unsplash_clay_15", "https://images.unsplash.com/photo-1560421683-680b9c814e52?auto=format&fit=crop&w=1200&q=80")
]

for name, url in test_list:
    dest = f"scratch/test_curated_clay/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
