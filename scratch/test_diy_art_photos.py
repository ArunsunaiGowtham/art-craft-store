import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

# Unsplash search API / public photos
topics = [
    ("Linocut block printing", "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"),
    ("Pottery craft shaping", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"),
    ("Papercraft origami floral", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
    ("Bookbinding craft journal", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"),
    ("Woodcraft tools studio", "https://images.unsplash.com/photo-1508873696983-2df570464756?auto=format&fit=crop&w=1200&q=80"),
    ("Botanical craft pressed flowers", "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80")
]

for name, u in topics:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            print(f"OK ({r.status}): {name} -> {len(r.read())} bytes")
    except Exception as e:
        print(f"FAILED: {name} -> {e}")
