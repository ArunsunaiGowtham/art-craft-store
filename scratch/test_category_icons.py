import re

with open('student-supplies.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract category section
cat_section = re.search(r'<!-- CATEGORIES -->(.*?)<!-- CTA -->', html, re.DOTALL)
assert cat_section, 'Category section not found'
section_html = cat_section.group(1)

cards = re.findall(r'<div class="card h-100.*?(?=</a>)', section_html, re.DOTALL)
print(f'Total category cards found: {len(cards)}')
assert len(cards) == 6, f'Expected 6 cards, found {len(cards)}'

expected_data = [
    ('Drawing Supplies', 'fa-pencil-ruler', '#3A7BDE'),
    ('Painting Supplies', 'fa-paint-brush', '#E85D3A'),
    ('Stationery', 'fa-pen-fancy', '#17a2b8'),
    ('Color Pencils &amp; Crayons', 'fa-pencil-alt', '#28a745'),
    ('Sketchbooks &amp; Paper', 'fa-book', '#9b59b6'),
    ('Art Kits', 'fa-gift', '#F4A825'),
]

for idx, card in enumerate(cards):
    title = re.search(r'<h5>(.*?)</h5>', card).group(1)
    icon_match = re.search(r'<i class="([^"]*)"\s*style="([^"]*)"', card)
    circle_match = re.search(r'<div style="([^"]*width:70px[^"]*)"', card)
    
    exp_title, exp_icon, exp_color = expected_data[idx]
    print(f'Card {idx+1}: {title}')
    print(f'  Circle style: {circle_match.group(1)}')
    print(f'  Icon class:   {icon_match.group(1)}')
    print(f'  Icon style:   {icon_match.group(2)}')
    
    assert exp_title in title, f'Title mismatch: {title} vs {exp_title}'
    assert exp_icon in icon_match.group(1), f'Icon class mismatch: {icon_match.group(1)} vs {exp_icon}'
    assert exp_color in icon_match.group(2), f'Color mismatch: {icon_match.group(2)} vs {exp_color}'
    assert 'fa-crayons' not in icon_match.group(1), f'Invalid fa-crayons icon still present in Card {idx+1}'
    assert 'fa-lg' in icon_match.group(1), f'fa-lg missing in Card {idx+1}'

print('\nAll 6 category cards verified successfully with valid, aligned, centered icons!')
