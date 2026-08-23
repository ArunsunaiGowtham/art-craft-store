import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

candidates = [
    ("DIY Botanical Papermaking", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
    ("DIY Handcrafted Pottery", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"),
    ("DIY Linocut Printmaking", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80"),
    ("DIY Woodcraft Workbench", "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80"),
    ("Modern Moulds Deckle (Wikimedia)", "https://upload.wikimedia.org/wikipedia/commons/2/23/Modern_papermaking_moulds_and_deckles.jpg")
]

for name, u in candidates:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            print(f"OK ({r.status}): {name} -> {len(r.read())} bytes")
    except Exception as e:
        print(f"FAILED: {name} -> {e}")
