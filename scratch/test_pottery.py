import urllib.request
import os

photo_ids = [
    "1531875456634-3f5418280d20",
    "1593508512255-86ab42a8e620",
    "1581291518633-83b4ebd1d83e",
    "1508700115892-45ecd05ae2ad",
    "1525909015000-01307b15949d",
    "1594913785162-e678a0c23ecb",
    "1569172122301-bc500f309134",
    "1576085898323-218337e3e43c",
    "1588854337236-6889d631faa8"
]

os.makedirs("scratch/pottery_test", exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for pid in photo_ids:
    url = f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w=800&q=80"
    dest = f"scratch/pottery_test/{pid}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = res.read()
            with open(dest, 'wb') as f:
                f.write(data)
            print(f"Downloaded {pid}: {len(data)/1024:.1f} KB")
    except Exception as e:
        print(f"Failed {pid}: {e}")
