import urllib.request
import re
import json

queries = [
    ("watercolor_art", "watercolor-painting-process"),
    ("calligraphy_art", "modern-calligraphy-lettering"),
    ("pottery_clay", "pottery-clay-craft"),
    ("urban_sketching", "sketchbook-drawing-architecture"),
    ("botanical_watercolor", "botanical-watercolor-painting"),
    ("art_workshop_studio", "art-workshop-studio-painting")
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for name, q in queries:
    url = f"https://unsplash.com/s/photos/{q}"
    print(f"\nFetching {name} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode('utf-8')
            # Extract image src urls
            matches = re.findall(r'https://images\.unsplash\.com/photo-([0-9a-zA-Z\-]+)\?([^"\'\s>]+)', html)
            print(f"  Found {len(matches)} images")
            unique_ids = list(dict.fromkeys([m[0] for m in matches]))[:5]
            for uid in unique_ids:
                img_url = f"https://images.unsplash.com/photo-{uid}?auto=format&fit=crop&w=800&q=80"
                print(f"    - {uid} -> {img_url}")
    except Exception as e:
        print(f"  Error: {e}")
