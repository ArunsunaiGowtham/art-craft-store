import urllib.request
import os

candidate_ids = [
    "1544816155-12df9643f363",
    "1513519245088-0e12902e5a38",
    "1526045612212-70caf35c14df",
    "1579783901586-d8800ac78ee1",
    "1579546929518-9e396f3cc809",
    "1582561424760-0321d75e81fa",
    "1578749556568-bc2c40e68b61"
]

os.makedirs("scratch/origami_test", exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for pid in candidate_ids:
    url = f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w=800&q=80"
    dest = f"scratch/origami_test/{pid}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = res.read()
            with open(dest, 'wb') as f:
                f.write(data)
            print(f"Downloaded {pid}: {len(data)/1024:.1f} KB")
    except Exception as e:
        print(f"Failed {pid}: {e}")
