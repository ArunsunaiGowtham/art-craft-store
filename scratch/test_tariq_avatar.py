import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

avatars = [
    ("Tariq Mansoor (1)", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80"),
    ("Tariq Mansoor (2)", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"),
    ("Tariq Mansoor (3)", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80")
]

for name, u in avatars:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            print(f"OK ({r.status}): {name} -> {len(r.read())} bytes")
    except Exception as e:
        print(f"FAILED: {name} -> {e}")
