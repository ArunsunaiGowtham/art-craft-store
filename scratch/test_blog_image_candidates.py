import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = {
    # 1. Watercolor Art Tips
    "watercolor_tips": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    # 2. Easel Product Guide
    "easel_guide": "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80",
    # 3. Color Theory Art Tips
    "color_theory": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    # 4. Home Art Studio DIY
    "home_studio_diy": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    # 5. Origami Paper Folding
    "origami_art": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    # 6. Acrylic Painting Techniques
    "acrylic_techniques": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    # 7. Candle Making Craft
    "candle_craft": "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80",
    # 8. Sketchbook Drawing
    "sketchbook_drawing": "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80",
    # 9. Watercolor Study Painting
    "watercolor_study": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80",
    # 10. Resin Craft Tutorial
    "resin_craft": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    # 11. DIY Picture Framing
    "diy_framing": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    # 12. Charcoal Drawing
    "charcoal_drawing": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    # 13. Origami Paper Guide
    "origami_paper": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    # 14. Art Workshop Experience
    "art_workshop": "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80",
    # 15. Pottery Workshop
    "pottery_workshop": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    # 16. Brush Guide Product
    "brush_guide": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    # 17. Origami History Art & Culture
    "origami_culture": "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80",
    # 18. Urban Sketching Art & Culture
    "urban_sketching_culture": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80"
}

for key, url in candidates.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        print(f"[{res.status}] {key:<25} -> OK")
    except Exception as e:
        print(f"[FAIL] {key:<25} -> {e}")
