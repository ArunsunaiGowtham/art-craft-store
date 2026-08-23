import urllib.request
import json
import re
import os

queries = {
    "watercolor_art": "https://unsplash.com/napi/search/photos?query=watercolor+painting+artist+brush&per_page=10",
    "calligraphy_art": "https://unsplash.com/napi/search/photos?query=calligraphy+lettering+hand&per_page=10",
    "pottery_clay": "https://unsplash.com/napi/search/photos?query=pottery+clay+hands+ceramic&per_page=10",
    "urban_sketching": "https://unsplash.com/napi/search/photos?query=urban+sketching+drawing+sketchbook&per_page=10",
    "botanical_watercolor": "https://unsplash.com/napi/search/photos?query=botanical+watercolor+flowers&per_page=10",
    "art_workshop_studio": "https://unsplash.com/napi/search/photos?query=art+workshop+painting+studio+easel&per_page=10"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

results = {}
for category, url in queries.items():
    print(f"\nSearching for {category}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            results[category] = []
            for item in data.get('results', [])[:5]:
                desc = item.get('alt_description') or item.get('description') or 'no desc'
                img_url = item.get('urls', {}).get('regular', '')
                results[category].append({'desc': desc, 'url': img_url})
                print(f"  - [{desc[:50]}] -> {img_url}")
    except Exception as e:
        print(f"  Error: {e}")

with open('scratch/unsplash_search_results.json', 'w') as f:
    json.dump(results, f, indent=2)
