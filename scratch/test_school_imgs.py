import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

test_urls = [
    ('Color Pencils', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'),
    ('Washable Markers (Walmart)', 'https://i5.walmartimages.com/seo/JoyCat-48-Count-Washable-Markers-Set-for-Kids-with-Storage-Case-48-Assorted-Colors-Coloring-Marker-Bulk-Gift-for-Child-School-Supplies_6d0121d6-34eb-493f-8952-f414da2358c0.fb3bef6205ef77aa07e3cbc14f77e420.jpeg'),
    ('Markers (Unsplash)', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'),
    ('Student Sketching Kit', 'https://rung.com.pk/cdn/shop/products/2300675A_grande.jpg?v=1593340585'),
    ('Art Supply Kit', 'https://images-na.ssl-images-amazon.com/images/I/61OfxxoKVyL.jpg')
]

for label, u in test_urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            print(f"OK ({r.status}): {label} -> {len(r.read())} bytes")
    except Exception as e:
        print(f"FAILED: {label} -> {e}")
