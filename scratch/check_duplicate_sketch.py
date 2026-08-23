import urllib.request
import ssl
from PIL import Image
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 1. Check images/product-arches-watercolor-paper.jpg
p1 = "images/product-arches-watercolor-paper.jpg"
im1 = Image.open(p1)
print(f"product-arches-watercolor-paper.jpg: size={im1.size}, bytes={os.path.getsize(p1)}")

# 2. Check https://kmartau.mo.cloudinary.net/23221790-96fa-4608-ab0d-cea1483481a1.jpg?tx=w_3840%2Ch_3840
url2 = "https://kmartau.mo.cloudinary.net/23221790-96fa-4608-ab0d-cea1483481a1.jpg?tx=w_3840%2Ch_3840"
try:
    req = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=8) as r:
        with open("scratch/kmart_sketchbook.jpg", "wb") as f:
            f.write(r.read())
    im2 = Image.open("scratch/kmart_sketchbook.jpg")
    print(f"kmart_sketchbook.jpg: size={im2.size}, bytes={os.path.getsize('scratch/kmart_sketchbook.jpg')}")
except Exception as e:
    print(f"Error fetching kmart: {e}")
