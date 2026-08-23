import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = {
    "pastel_art_palette": "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=800&q=80",
    "creative_studio_warm": "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80",
    "art_materials_desk": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"
}

for name, url in candidates.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        print(f"[{res.status}] {name:<25} -> OK")
    except Exception as e:
        print(f"[FAIL] {name:<25} -> {e}")
