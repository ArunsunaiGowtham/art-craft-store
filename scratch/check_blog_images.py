import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

posts = re.findall(r'id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?categories:\s*(\[[^\]]+\]),[\s\S]*?image:\s*"([^"]+)"', content)

print(f"Total blog posts found: {len(posts)}\n")
for pid, title, cat, cats, img in posts:
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        status = res.status
    except Exception as e:
        status = f"ERROR: {e}"
    print(f"Post #{pid}: \"{title}\"")
    print(f"  Category: {cat} | Categories: {cats}")
    print(f"  Image: {img} -> [{status}]\n")
