import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Fabric%20paint%20OR%20Textile%20dye%20OR%20Gutta&srnamespace=6&srlimit=10&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'ArtCraftStore/2.0'})
res = json.loads(urllib.request.urlopen(req, context=ctx).read().decode('utf-8'))
for item in res.get('query', {}).get('search', []):
    print(item['title'])
