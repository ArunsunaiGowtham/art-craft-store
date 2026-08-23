import urllib.request
import os

candidates = [
    ("urban_1", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"),
    ("urban_2", "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&w=800&q=80"),
    ("urban_3", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"),
    ("urban_4", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"),
    ("urban_5", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"),
    ("urban_6", "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80")
]

os.makedirs('scratch/test_urban', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = res.read()
            path = f'scratch/test_urban/{name}.jpg'
            with open(path, 'wb') as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
