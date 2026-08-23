import urllib.request
import urllib.parse
import json
import ssl
import re
import os
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_walmart_images(query):
    # Search walmart product catalog or duckduckgo walmart images
    url = f"https://www.walmart.com/search?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    images = []
    try:
        html = urllib.request.urlopen(req, context=ctx, timeout=10).read().decode('utf-8', errors='ignore')
        # find walmart image URLs
        found = re.findall(r'https://i5\.walmartimages\.com/asr/[a-zA-Z0-9\-_]+\.[a-zA-Z0-9]+\.jpeg', html)
        images = list(dict.fromkeys(found))
    except Exception as e:
        print(f"Walmart search error for {query}:", e)
    return images

def test_download_and_crop(url, dest_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = resp.read()
            temp_path = dest_path + ".temp.jpg"
            with open(temp_path, 'wb') as f:
                f.write(data)
            
            im = Image.open(temp_path).convert('RGB')
            w, h = im.size
            print(f"Downloaded {url} -> {w}x{h}")
            
            # Crop to 4:3
            target_ratio = 4/3
            if w / h > target_ratio:
                new_w = int(h * target_ratio)
                offset = (w - new_w) // 2
                im = im.crop((offset, 0, offset + new_w, h))
            else:
                new_h = int(w / target_ratio)
                offset = (h - new_h) // 2
                im = im.crop((0, offset, w, offset + new_h))
            
            im = im.resize((800, 600), Image.LANCZOS)
            im.save(dest_path, "JPEG", quality=95)
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"Successfully created {dest_path}: {im.size} ({os.path.getsize(dest_path)} bytes)")
            return True
    except Exception as e:
        print(f"Error downloading {url}:", e)
        return False

print("1. Searching Walmart for Modeling Clay 36 colors...")
m_images = search_walmart_images("modeling clay 36 colors air dry kit")
print(f"Found {len(m_images)} images:")
for u in m_images[:6]:
    print(" ", u)

print("\n2. Searching Walmart for Air Dry Clay 10 pack / assorted...")
a_images = search_walmart_images("air dry clay pack assorted colors")
print(f"Found {len(a_images)} images:")
for u in a_images[:6]:
    print(" ", u)

print("\n3. Searching Walmart for Sculpey Premo polymer clay multipack...")
p_images = search_walmart_images("sculpey premo polymer clay sampler pack")
print(f"Found {len(p_images)} images:")
for u in p_images[:6]:
    print(" ", u)
