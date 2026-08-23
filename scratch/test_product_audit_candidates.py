import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = {
    # Product 10: Sculpting Tools Professional Set (Ceramic & clay tools)
    "p10_sculpting_tools": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
    "p10_clay_tools_alt": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",

    # Product 15: Origami Advanced Kit (Complex origami folded art)
    "p15_origami_advanced": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    "p15_origami_crane": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",

    # Product 16: Calligraphy Pen Set (Calligraphy pens, nibs, ink)
    "p16_calligraphy_pen": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",

    # Product 18: Washable Markers 48 Pack (Felt tip markers / coloring markers)
    "p18_markers_pack": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
    "p18_markers_bright": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
}

for name, url in candidates.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        print(f"[{res.status}] {name:<25} -> OK")
    except Exception as e:
        print(f"[FAIL] {name:<25} -> {e}")
