import urllib.request
import os

# Curated list of genuine Unsplash art photos specifically matching each workshop topic
photo_urls = {
    # 1. Watercolor Painting in progress with palette and paper
    "workshop-watercolor-painting.jpg": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    
    # 2. Modern Calligraphy & Brush Lettering in progress with ink
    "workshop-calligraphy-lettering.jpg": "https://images.unsplash.com/photo-1508669232496-137b159c1cdb?auto=format&fit=crop&w=800&q=80",
    
    # 3. Pottery / Hand Building with Clay - Hands shaping wet clay
    "workshop-pottery-clay-sculpting.jpg": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    
    # 5. Fluid Acrylic Pouring / Abstract Pouring with colorful cells
    "workshop-acrylic-fluid-art.jpg": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    
    # 6. Urban Sketching / Architectural Sketchbook with pencils and ink
    "workshop-urban-sketching-art.jpg": "https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=800&q=80",
    
    # 7. Candle Making - Handcrafting soy wax candles in amber jars with botanicals
    "workshop-candle-making-craft.jpg": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    
    # 9. Botanical Watercolor - Delicate floral and botanical painting
    "workshop-botanical-watercolor-art.jpg": "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80",
    
    # Hero Upcoming Banner - Creative art studio painting workshop session with easels and artists
    "workshop-hero-upcoming-events.jpg": "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
    
    # Hero All Banner - Art studio workshop overview
    "workshop-hero-all-studio.jpg": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"
}

headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in photo_urls.items():
    dest = os.path.join('images', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            data = res.read()
            with open(dest, 'wb') as f:
                f.write(data)
            print(f"Downloaded {name}: {len(data)/1024:.1f} KB -> {dest}")
    except Exception as e:
        print(f"Error downloading {name}: {e}")
