import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

candidates = [
    ("Sketching pencil drawing", "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80"),
    ("Open sketchbook journal", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"),
    ("Pencil sketch architecture", "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80"),
    ("Artist sketching hands", "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80"),
    ("Perspective drawing (Commons)", "https://upload.wikimedia.org/wikipedia/commons/8/85/Perspective_drawing_01.jpg"),
    ("Rotring drawing (Commons)", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Rotring_S0214750_with_Rapidograph_0.5_mm_drawing_1.5%E2%80%9315_mm_circles.jpg")
]

for name, u in candidates:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            print(f"OK ({r.status}): {name} -> {len(r.read())} bytes")
    except Exception as e:
        print(f"FAILED: {name} -> {e}")
