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
    ("https://images.unsplash.com/photo-1518895949257-7621c3c786d7", "artist painting watercolor palette brushes paper"),
    ("https://images.unsplash.com/photo-1579783901586-d88db74b4fe4", "watercolor painting in action palette"),
    ("https://images.unsplash.com/photo-1513364776144-60967b0f800f", "watercolor palette"), # check if used
    ("https://images.unsplash.com/photo-1582561424760-0321d75e81fa", "watercolor kit"),
    ("https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b", "studio easel"),
    ("https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1", "watercolor art study"),
    ("https://images.unsplash.com/photo-1580136579312-94651dfd596d", "studio"),
    ("https://images.unsplash.com/photo-1544717305-2782549b5136", "portrait"),
    ("https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b", "creative art workshop"),
    ("https://images.unsplash.com/photo-1513519245088-0e12902e5a38", "crafts")
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
