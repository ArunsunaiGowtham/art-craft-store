import urllib.request

candidates = [
    ("watercolor_paper_pad_1", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"),
    ("watercolor_paper_pad_2", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"),
    ("watercolor_paper_pad_3", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"),
    ("watercolor_pad_4", "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80"),
    ("watercolor_pad_5", "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"),
    ("watercolor_pad_6", "https://m.media-amazon.com/images/I/71P4m-u3x9L._AC_SL1500_.jpg"),
    ("watercolor_pad_7", "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80")
]

for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
            print(f"{name}: {len(data)} bytes")
    except Exception as e:
        print(f"{name}: failed ({e})")
