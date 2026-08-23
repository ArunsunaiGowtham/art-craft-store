import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtCraftStore/1.0'}

downloads = [
    ("scratch/paper_marbling.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a2/Paper_Marbling_Tank.jpg"),
    ("scratch/woodblock_print.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/23/Wood_Block_Printing_01.jpg")
]

for dest, u in downloads:
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest}")
