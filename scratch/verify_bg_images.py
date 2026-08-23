import os

bg_dir = 'images/backgrounds'
expected = ['shop-bg.jpg','about-bg.jpg','blog-bg.jpg','workshops-bg.jpg','brands-bg.jpg','contact-bg.jpg','membership-bg.jpg','product-bg.jpg']
print('=== Background Images ===')
for f in expected:
    path = os.path.join(bg_dir, f)
    exists = os.path.exists(path)
    size = round(os.path.getsize(path)/1024) if exists else 0
    status = 'OK' if exists else 'MISSING'
    print(f'  [{status}] {f} ({size}KB)')

with open('css/style.css','r',encoding='utf-8') as f:
    css = f.read()

print()
print('=== CSS Rules ===')
classes = ['.shop-hero','.about-story-hero','.blog-hero-section','.workshops-hero-section','.brand-spotlight-hero','.contact-hero','.membership-hero','.product-page-hero']
for c in classes:
    found = c in css
    status = 'OK' if found else 'MISSING'
    print(f'  [{status}] {c}')

pages = [('shop.html','shop-hero'),('about.html','about-story-hero'),('contact.html','contact-hero'),('pricing.html','membership-hero'),('product-details.html','product-page-hero')]
print()
print('=== HTML Page Classes ===')
for page, cls in pages:
    with open(page,'r',encoding='utf-8') as f:
        html = f.read()
    found = cls in html
    status = 'OK' if found else 'MISSING'
    print(f'  [{status}] {page} -> {cls}')

print()
print('Done.')
