import urllib.request
import re
import json

req = urllib.request.Request("https://unsplash.com/s/photos/polymer-clay", headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')

# find photo urls
matches = re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9-]+', html)
unique_urls = list(dict.fromkeys(matches))
print(f"Found {len(unique_urls)} unique photo URLs from unsplash polymer-clay:")
for i, u in enumerate(unique_urls[:10]):
    print(f"Photo {i}: {u}")
    try:
        img_data = urllib.request.urlopen(u + "?auto=format&fit=crop&w=800&q=80", timeout=5).read()
        with open(f"scratch/unsplash_clay_{i}.jpg", "wb") as f:
            f.write(img_data)
        print(f"  -> Downloaded scratch/unsplash_clay_{i}.jpg ({len(img_data)} bytes)")
    except Exception as e:
        print(f"  -> Failed {e}")
