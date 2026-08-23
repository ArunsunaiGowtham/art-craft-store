import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtStore/1.0'}

downloads = [
    ("scratch/draw_sketchbook.jpg", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"),
    ("scratch/draw_pencil_arch.jpg", "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80"),
    ("scratch/draw_pencil_hands.jpg", "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80"),
    ("scratch/draw_perspective.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/85/Perspective_drawing_01.jpg")
]

for dest, u in downloads:
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest}")
