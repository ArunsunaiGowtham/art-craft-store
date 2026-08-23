import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

urls = [
    ('scratch/oil_palette_knife.jpg', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'),
    ('scratch/painter_hands_palette.jpg', 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80'),
    ('scratch/oil_canvas_studio.jpg', 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=80')
]

for dest, u in urls:
    print(f"Downloading {u} -> {dest}")
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
