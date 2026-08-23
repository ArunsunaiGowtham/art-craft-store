import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

downloads = [
    ("scratch/lines_sketchbook.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/66/Lines_family_sketchbook_-_Northgate%2C_Bridgnorth.jpg"),
    ("scratch/drawing_class.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/11/Photo_of_still_life_sketch_or_drawing.jpg")
]

for dest, u in downloads:
    req = urllib.request.Request(u, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print(f"Saved {dest}")
