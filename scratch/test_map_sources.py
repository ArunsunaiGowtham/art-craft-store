import urllib.request

urls = [
    ("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "Leaflet JS unpkg"),
    ("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "Leaflet CSS unpkg"),
    ("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js", "Leaflet JS cdnjs"),
    ("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css", "Leaflet CSS cdnjs"),
    ("https://www.openstreetmap.org/export/embed.html?bbox=-74.0034%2C40.7434%2C-73.9834%2C40.7534&layer=mapnik&marker=40.7484%2C-73.9934", "OSM embed"),
    ("https://maps.google.com/maps?q=40.7484,-73.9934&hl=en&z=15&output=embed", "Google Maps lat/long embed"),
    ("https://tile.openstreetmap.org/15/9649/12316.png", "OSM Tile check")
]

for url, desc in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=5)
        print(f"[200 OK] {desc}: {url}")
    except Exception as e:
        print(f"[ERROR] {desc}: {e}")
