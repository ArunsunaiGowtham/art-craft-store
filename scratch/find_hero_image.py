import re, glob, urllib.request

all_unsplash = set()
for ext in ('*.html', 'js/*.js'):
    for f in glob.glob(ext):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            matches = re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+', content)
            all_unsplash.update(matches)

print(f"Total existing Unsplash URLs: {len(all_unsplash)}")

hero_candidates = [
    ("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119", "watercolor painting workshop"),
    ("https://images.unsplash.com/photo-1513364776144-60967b0f800f", "palette / art workshop"),
    ("https://images.unsplash.com/photo-1563089145-599997674d42", "acrylic color tubes"),
    ("https://images.unsplash.com/photo-1582561424760-0321d75e81fa", "watercolor kit"),
    ("https://images.unsplash.com/photo-1579783902614-a3fb3927b675", "art workshop piece"),
    ("https://images.unsplash.com/photo-1579783901586-d88db74b4fe4", "watercolor painting in progress with brushes"),
    ("https://images.unsplash.com/photo-1544717305-2782549b5136", "drawing"),
    ("https://images.unsplash.com/photo-1506806732259-39c2d0268443", "candle"),
    ("https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b", "easel studio workshop"),
    ("https://images.unsplash.com/photo-1513519245088-0e12902e5a38", "crafts"),
    ("https://images.unsplash.com/photo-1560421683-680b9c8d4222", "art workshop group painting"),
    ("https://images.unsplash.com/photo-1525909002-1b05e0c869d8", "art creative workshop painting")
]

for url, desc in hero_candidates:
    base = url.split('?')[0]
    is_used = any(base in u for u in all_unsplash)
    req = urllib.request.Request(url + "?auto=format&fit=crop&w=800&q=80", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=5)
        status = resp.status
    except Exception as e:
        status = str(e)
    print(f"[{'USED' if is_used else 'AVAILABLE'}] Status: {status} | Desc: {desc} | URL: {url}")
