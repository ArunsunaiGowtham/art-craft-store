import re, glob, urllib.request

all_unsplash = set()
for ext in ('*.html', 'js/*.js'):
    for f in glob.glob(ext):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            matches = re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+', content)
            all_unsplash.update(matches)

print(f"Total existing Unsplash URLs in workspace: {len(all_unsplash)}")

candidates = [
    # Professional artist palette / artist tools / mixing palette
    ("https://images.unsplash.com/photo-1513364776144-60967b0f800f", "palette 1"), # check if duplicate
    ("https://images.unsplash.com/photo-1579783902614-a3fb3927b675", "art palette / brushes"),
    ("https://images.unsplash.com/photo-1579783901586-d88db74b4fe4", "palette acrylic"),
    ("https://images.unsplash.com/photo-1580136579312-94651dfd596d", "easel/studio"),
    ("https://images.unsplash.com/photo-1518895949257-7621c3c786d7", "color palette / brushes"),
    ("https://images.unsplash.com/photo-1579783928621-7a13d66a62d1", "palette knives"),
    ("https://images.unsplash.com/photo-1578301978693-85fa9c0320b9", "charcoal"),
    ("https://images.unsplash.com/photo-1536924940846-227afb31e2a5", "artist paint palette tools"),
    ("https://images.unsplash.com/photo-1579783929314-e538ef8bf213", "art materials palette"),
    ("https://images.unsplash.com/photo-1509198397868-475647b2a1e5", "wood palette brushes")
]

for url, desc in candidates:
    base = url.split('?')[0]
    is_used = any(base in u for u in all_unsplash)
    req = urllib.request.Request(url + "?auto=format&fit=crop&w=600&q=80", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=5)
        status = resp.status
    except Exception as e:
        status = str(e)
    print(f"[{'USED' if is_used else 'AVAILABLE'}] Status: {status} | Desc: {desc} | URL: {url}")
