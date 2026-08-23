import urllib.request
import urllib.parse
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtStoreCraftFetcher/1.0 (contact@artcraft.org)'}

queries = ["macrame", "pottery", "ceramic art", "mosaic", "stained glass", "embroidery"]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&srlimit=5&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"--- Query: {q} ---")
            for item in data.get('query', {}).get('search', []):
                print(item.get('title'))
    except Exception as e:
        print(f"Error {q}: {e}")
