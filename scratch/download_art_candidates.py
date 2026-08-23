import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 ArtCraftBot/1.0 (contact@artcraft.local)'}

urls = [
    ('scratch/matson_easel.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/88/Eric_Matson_painting_at_an_easel%2C_probably_in_California_LOC_matpc.23234_%28cropped%29.jpg'),
    ('scratch/cezanne_palette.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Paul_C%C3%A9zanne%2C_c.1890%2C_Portrait_de_l%27artiste_%C3%A0_la_palette%2C_oil_on_canvas%2C_92_x_73_cm%2C_Foundation_E.G._B%C3%BChrle.jpg')
]

for dest, u in urls:
    try:
        print(f"Downloading {u} -> {dest}")
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
            f.write(r.read())
        print(f"Saved {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
    except Exception as e:
        print(f"Error {dest}: {e}")
