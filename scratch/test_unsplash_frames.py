import urllib.request
import os

candidates = [
    ("frame_1", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"),
    ("frame_2", "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80"),
    ("frame_3", "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80"),
    ("frame_4", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"),
    ("studio_1", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"),
    ("studio_2", "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80"),
    ("studio_3", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80")
]

os.makedirs('scratch/test_frames', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = res.read()
            path = f'scratch/test_frames/{name}.jpg'
            with open(path, 'wb') as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
