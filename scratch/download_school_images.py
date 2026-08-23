import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ArtStore/1.0'}

downloads = [
    ('scratch/raw_pencils.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Buntstifte_--_2021_--_9151.jpg'),
    ('scratch/raw_markers.jpg', 'https://i5.walmartimages.com/seo/JoyCat-48-Count-Washable-Markers-Set-for-Kids-with-Storage-Case-48-Assorted-Colors-Coloring-Marker-Bulk-Gift-for-Child-School-Supplies_6d0121d6-34eb-493f-8952-f414da2358c0.fb3bef6205ef77aa07e3cbc14f77e420.jpeg'),
    ('scratch/raw_sketching.jpg', 'https://rung.com.pk/cdn/shop/products/2300675A_grande.jpg?v=1593340585'),
    ('scratch/raw_artkit.jpg', 'https://images-na.ssl-images-amazon.com/images/I/61OfxxoKVyL.jpg')
]

for dest, u in downloads:
    try:
        print(f"Downloading {u} -> {dest}")
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
            f.write(r.read())
        print(f"Saved {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
    except Exception as e:
        print(f"Error {dest}: {e}")
