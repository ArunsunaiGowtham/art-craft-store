with open('css/style.css','r',encoding='utf-8') as f:
    css = f.read()

checks = [
    ('.featured-article-card','Featured card base'),
    ('.featured-article-row','Featured row grid'),
    ('grid-template-columns: 1fr 1fr','Two-column grid'),
    ('align-items: stretch','Stretch alignment'),
    ('.featured-article-img-col img','Image fill rule'),
    ('object-fit: cover','Object-fit cover'),
    ('position: absolute','Absolute fill image'),
    ('.featured-article-content','Content column flex'),
    ('.article-heading','Article heading CSS'),
    ('.article-meta','Article meta CSS'),
    ('.article-featured-img-wrap','Article img wrap'),
    ('.article-featured-img','Article img CSS'),
    ('.article-body','Article body CSS'),
]

print('CSS Checks:')
all_ok = True
for sel, label in checks:
    found = sel in css
    if not found:
        all_ok = False
    status = 'OK' if found else 'FAIL'
    print(f'  [{status}] {label}')

with open('blog.html','r',encoding='utf-8') as f:
    blog = f.read()
with open('blog-details.html','r',encoding='utf-8') as f:
    details = f.read()

html_checks = [
    (blog,'featured-article-card','blog.html: card class'),
    (blog,'featured-article-row','blog.html: row class'),
    (blog,'featured-article-img-col','blog.html: img col class'),
    (details,'article-featured-img-wrap','blog-details: img wrap'),
    (details,'article-featured-img','blog-details: img class'),
    (details,'article-heading','blog-details: h1 class'),
    (details,'article-meta','blog-details: meta class'),
]

print()
print('HTML Checks:')
for src, token, label in html_checks:
    found = token in src
    if not found:
        all_ok = False
    status = 'OK' if found else 'FAIL'
    print(f'  [{status}] {label}')

print()
print('ALL PASSED' if all_ok else 'SOME FAILED')
