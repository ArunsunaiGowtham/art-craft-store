import urllib.request
import urllib.parse
import json
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_duckduckgo_images(query, max_results=10):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract image urls
            urls = re.findall(r'//external-content\.duckduckgo\.com/iu/\?u=([^&"]+)', html)
            decoded = [urllib.parse.unquote(u) for u in urls]
            return decoded[:max_results]
    except Exception as e:
        print(f"Error searching DDG for {query}:", e)
        return []

print("Modeling clay:")
for u in search_duckduckgo_images("modeling clay 36 colors set product box", 5):
    print(" ", u)

print("Air dry clay 10 pack:")
for u in search_duckduckgo_images("air dry clay pack 10 colors blocks product", 5):
    print(" ", u)

print("Sculpey Premo polymer clay:")
for u in search_duckduckgo_images("Sculpey Premo polymer clay sampler pack 24 or 30", 5):
    print(" ", u)
