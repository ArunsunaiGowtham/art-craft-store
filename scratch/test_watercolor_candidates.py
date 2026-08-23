import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

candidates = [
    ("Watercolor paint pans", "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=1200&q=80"),
    ("Watercolor artist workspace", "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80"),
    ("Color theory palette", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80")
]

for name, u in candidates:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            data = r.read()
            print(f"OK ({r.status}): {name} -> {len(data)} bytes")
            with open(f"scratch/{name.replace(' ', '_').lower()}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"FAILED {name}: {e}")
