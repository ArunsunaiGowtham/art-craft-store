import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Koh-i-noor_Hardtmuth_pencils.jpg/1280px-Koh-i-noor_Hardtmuth_pencils.jpg"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/4.0'})
data = urllib.request.urlopen(req, context=ctx).read()
with open("scratch/koh_i_noor_pencils.jpg", "wb") as f:
    f.write(data)
print("Saved scratch/koh_i_noor_pencils.jpg:", len(data), "bytes")
