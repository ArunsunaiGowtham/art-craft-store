import re, glob, urllib.request

all_unsplash = set()
for ext in ('*.html', 'js/*.js'):
    for f in glob.glob(ext):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            matches = re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+', content)
            all_unsplash.update(matches)

print(f"Total existing Unsplash URLs: {len(all_unsplash)}")

candidates = [
    ("https://images.unsplash.com/photo-1582561424760-0321d75e81fa", "painting kit"), # check if used
    ("https://images.unsplash.com/photo-1579783902614-a3fb3927b675", "watercolor art piece / paints"),
    ("https://images.unsplash.com/photo-1513364776144-60967b0f800f", "watercolor 1"),
    ("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119", "watercolor 2"),
    ("https://images.unsplash.com/photo-1541701494587-cb58502866ab", "acrylic/gouache"),
    ("https://images.unsplash.com/photo-1579783928621-7a13d66a62d1", "knives"),
    ("https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1", "watercolor students"),
    ("https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b", "easel"),
    ("https://images.unsplash.com/photo-1518895949257-7621c3c786d7", "watercolor mixing brushes"),
    ("https://images.unsplash.com/photo-1536924940846-227afb31e2a5", "watercolor artist at work"),
    ("https://images.unsplash.com/photo-1563089145-599997674d42", "acrylic tubes")
]

for url, desc in candidates:
    base = url.split('?')[0]
    is_used = any(base in u for u in all_unsplash)
    req = urllib.request.Request(url + "?auto=format&fit=crop&w=800&q=80", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=5)
        status = resp.status
    except Exception as e:
        status = str(e)
    print(f"[{'USED' if is_used else 'AVAILABLE'}] Status: {status} | Desc: {desc} | URL: {url}")
