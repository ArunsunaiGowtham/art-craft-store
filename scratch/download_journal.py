import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

downloads = [
    ("scratch/journal.jpg", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"),
    ("scratch/botanical.jpg", "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80")
]

for dest, u in downloads:
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest}")
