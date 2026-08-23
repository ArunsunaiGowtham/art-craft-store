import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtStore/1.0'}

downloads = [
    ("scratch/deckle.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/23/Modern_papermaking_moulds_and_deckles.jpg"),
    ("scratch/bookbind_tools.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/6b/Decorative_tools_%28bookbinding%29.jpg"),
    ("scratch/handmade_book.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e5/Handmade_book.jpg")
]

for dest, u in downloads:
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest}")
