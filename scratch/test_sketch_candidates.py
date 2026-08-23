import urllib.request
import os

candidates = [
    ("sketch_1", "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80"),
    ("sketch_2", "https://images.unsplash.com/photo-1588856093847-ec5c0d5402bf?auto=format&fit=crop&w=800&q=80"),
    ("sketch_3", "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"),
    ("sketch_4", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"),
    ("sketch_5", "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80"),
    ("sketch_6", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80")
]

os.makedirs('scratch/test_sketch', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = res.read()
            path = f'scratch/test_sketch/{name}.jpg'
            with open(path, 'wb') as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
