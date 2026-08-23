import urllib.request
import ssl
import os
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArtCraftEasel/1.0 (contact@artcraft.local)'}

u = 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Claude_Monet_-_In_the_Woods_at_Giverny-_Blanche_Hosched%C3%A9_at_Her_Easel_with_Suzanne_Hosched%C3%A9_Reading_-_Google_Art_Project.jpg'
dest = 'scratch/monet_easel_painting.jpg'

print(f"Downloading {u} -> {dest}")
req = urllib.request.Request(u, headers=headers)
with urllib.request.urlopen(req, context=ctx) as r, open(dest, 'wb') as f:
    f.write(r.read())
print(f"Saved {dest} ({os.path.getsize(dest)/1024:.1f} KB)")
