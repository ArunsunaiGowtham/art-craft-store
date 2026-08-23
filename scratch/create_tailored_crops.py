from PIL import Image
import os

# 1. Workshop 1: Watercolor Basics for Beginners
# Source: images/backgrounds/product-bg.jpg (1920x1080)
# We want a 4:3 / 16:9 crop focusing on the palette and sable brushes
with Image.open('images/backgrounds/product-bg.jpg') as img:
    w, h = img.size
    # Crop focusing on palette and sable brushes
    crop_w1 = img.crop((0, int(h * 0.1), int(w * 0.85), int(h * 0.95)))
    crop_w1.save('images/workshop-watercolor-basics.jpg', quality=95)
    print("Saved images/workshop-watercolor-basics.jpg")

# 2. Workshop 2: Modern Calligraphy Workshop
# Source: images/backgrounds/brands-bg.jpg (1920x1080)
# Focus on calligraphy dip pen, ink bottles, and calligraphy paper on left
with Image.open('images/backgrounds/brands-bg.jpg') as img:
    w, h = img.size
    crop_w2 = img.crop((0, int(h * 0.25), int(w * 0.55), h))
    crop_w2.save('images/workshop-modern-calligraphy.jpg', quality=95)
    print("Saved images/workshop-modern-calligraphy.jpg")

# 6. Workshop 6: Sketching Urban Landscapes
# Source: images/backgrounds/about-bg.jpg (1920x1080)
# Focus on the artist drawing desk with open sketchbooks, pencils, and easels
with Image.open('images/backgrounds/about-bg.jpg') as img:
    w, h = img.size
    crop_w6 = img.crop((int(w * 0.15), int(h * 0.35), int(w * 0.75), int(h * 0.95)))
    crop_w6.save('images/workshop-urban-sketching.jpg', quality=95)
    print("Saved images/workshop-urban-sketching.jpg")

# 9. Workshop 9: Botanical Watercolor Illustration
# Source: images/backgrounds/blog-bg.jpg (1920x1080)
# Focus on botanical floral watercolor, leaves, and paintbrush
with Image.open('images/backgrounds/blog-bg.jpg') as img:
    w, h = img.size
    crop_w9 = img.crop((int(w * 0.4), 0, int(w * 0.95), int(h * 0.95)))
    crop_w9.save('images/workshop-botanical-watercolor.jpg', quality=95)
    print("Saved images/workshop-botanical-watercolor.jpg")

# Hero All Banner: Bright art studio overview
with Image.open('images/backgrounds/about-bg.jpg') as img:
    img.save('images/workshop-hero-all-studio.jpg', quality=95)
    print("Saved images/workshop-hero-all-studio.jpg")

# Hero Upcoming Banner: Studio workshop session with students painting on easels
with Image.open('images/backgrounds/workshops-bg.jpg') as img:
    img.save('images/workshop-hero-upcoming-studio.jpg', quality=95)
    print("Saved images/workshop-hero-upcoming-studio.jpg")
