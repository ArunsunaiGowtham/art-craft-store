import urllib.request
import ssl
import json
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraftStore/1.0'}

urls = {
    'scratch/macrame_knots_raw.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Macrame_Basic_Knots.jpg',
    'scratch/resin_art_raw.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/84/%22Aurora_Borealis%22_-_manmade_opalescent_resin_10_-_54574496710.jpg',
    'scratch/leathercraft_raw.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/55/Artesan%C3%ADa_en_Cuero%2C_Atyra.jpg',
    'scratch/embroidery_raw.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Embroidery_on_a_cashmere_shawl_05.jpg'
}

for dest, u in urls.items():
    print(f"Downloading {u} -> {dest}")
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Done. Size: {os.path.getsize(dest)/1024:.1f} KB")
