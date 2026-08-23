import urllib.request
import re

new_workshop_images = {
    1: ("Watercolor Basics for Beginners", "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80"),
    2: ("Modern Calligraphy Workshop", "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80"),
    3: ("Hand Building with Clay", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"),
    4: ("Origami Art: From Basic to Advanced", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"),
    5: ("Acrylic Pouring Masterclass", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"),
    6: ("Sketching Urban Landscapes", "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80"),
    7: ("Candle Making for Beginners", "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80"),
    8: ("Advanced Portrait Drawing", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80")
}

print("Testing 8 new workshop images for HTTP 200 and uniqueness:\n")

photo_ids = set()
all_passed = True

for wid, (title, url) in new_workshop_images.items():
    m = re.search(r'photo-([a-zA-Z0-9_-]+)', url)
    pid = m.group(1) if m else url
    if pid in photo_ids:
        print(f"DUPLICATE within workshops: Workshop {wid} -> {pid}")
        all_passed = False
    photo_ids.add(pid)

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as response:
            status = response.getcode()
            print(f"PASS ({status}): Workshop {wid} ({title})\n  URL: {url}")
    except Exception as e:
        print(f"FAIL: Workshop {wid} ({title}) -> {e}")
        all_passed = False

print(f"\nUnique workshop images count: {len(photo_ids)} / {len(new_workshop_images)}")
if all_passed:
    print("ALL 8 WORKSHOP IMAGES ARE UNIQUE AND VALID!")
