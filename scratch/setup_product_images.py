import shutil
import urllib.request

# Copy clay_blocks_2.jpg to images/product-sculpey-polymer-clay.jpg
shutil.copy("scratch/clay_blocks_2.jpg", "images/product-sculpey-polymer-clay.jpg")
print("Saved images/product-sculpey-polymer-clay.jpg")

# Search and download high quality watercolor paper pad
arches_urls = [
    ("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", "old_book"),
    ("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", "art_palette"),
    ("https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80", "oil_palette"),
    ("https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80", "watercolor_set"),
    ("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80", "paper_texture"),
    ("https://images.unsplash.com/photo-1544716278-e5e31f9076f8?auto=format&fit=crop&w=600&q=80", "watercolor_book"),
    ("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80", "sketch_paper")
]

for url, name in [
    ("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", "craft_gallery"),
    ("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80", "paint_art"),
    ("https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80", "notebook")
]:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = response.read()
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
