import urllib.request
import urllib.parse
import ssl
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

os.makedirs('scratch/wm_clay_test', exist_ok=True)

urls = [
    ("play_dough_4784", "https://upload.wikimedia.org/wikipedia/commons/b/bc/Play_dough_04784.jpg"),
    ("play_dough_4770", "https://upload.wikimedia.org/wikipedia/commons/3/36/Play_dough_04770.jpg"),
    ("play_dough_4775", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Play_dough_04775.jpg"),
    ("play_dough_4780", "https://upload.wikimedia.org/wikipedia/commons/8/8f/Play_dough_04780.jpg"),
    ("play_dough_4757", "https://upload.wikimedia.org/wikipedia/commons/3/31/Play_dough_04757.jpg"),
    ("play_dough_4759", "https://upload.wikimedia.org/wikipedia/commons/5/57/Play_dough_04759.jpg"),
    ("play_dough_4762", "https://upload.wikimedia.org/wikipedia/commons/e/e7/Play_dough_04762.jpg"),
    ("pates_autodurcissantes", "https://upload.wikimedia.org/wikipedia/commons/3/31/Pates-autodurcissantes.jpg"),
    ("play_doh_nuernberg", "https://upload.wikimedia.org/wikipedia/commons/a/a2/2016_Nuernberger_Spielwarenmesse_-_Play-Doh_-_by_2eight_%28cropped%29.jpg"),
    ("colorful_plasticine", "https://upload.wikimedia.org/wikipedia/commons/2/2d/Colorful_plasticine_with_child_in_background.jpg")
]

for name, u in urls:
    dest = f"scratch/wm_clay_test/{name}.jpg"
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            data = r.read()
            with open(dest, 'wb') as f:
                f.write(data)
            im = Image.open(dest)
            print(f"Downloaded {name}: {im.size} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")
