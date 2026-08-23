import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = {
    # Candle Making (Product 22):
    "candle_craft": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    "candle_artisan": "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=800&q=80",
    
    # Macrame (Product 23):
    "macrame_craft": "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80",
    "macrame_yarn": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    
    # Embroidery (Product 24):
    "embroidery_hoop": "https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=600&q=80",
    "embroidery_threads": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    
    # Sakura (Brand 3) or Calligraphy (Workshop 2):
    "calligraphy_pen": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    "sakura_micron": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    "artist_ink": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"
}

for name, url in candidates.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        print(f"[{res.status}] {name:<20} -> OK")
    except Exception as e:
        print(f"[FAIL] {name:<20} -> {e}")
