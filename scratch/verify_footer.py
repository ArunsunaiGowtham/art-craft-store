with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

checks = [
    ('.footer {', 'Footer base rule'),
    ('.footer .container {', 'Container override'),
    ('padding-inline: 32px', 'Container padding 32px'),
    ('.footer-grid {', 'Footer grid'),
    ('grid-template-columns: 1.7fr 1fr 1fr 1.5fr', 'Proportional columns'),
    ('.footer-bottom {', 'Footer bottom'),
    ('text-align: center', 'Copyright centered'),
    ('#scroll-top,', 'Scroll top CSS'),
    ('position: fixed', 'Scroll top fixed'),
    ('opacity: 0', 'Scroll top hidden by default'),
    ('.visible {', 'Visible class'),
    ('repeat(2, 1fr)', 'Tablet 2-col grid'),
    ('grid-template-columns: 1fr', 'Mobile 1-col grid'),
]

print('=== CSS Checks ===')
all_ok = True
for selector, label in checks:
    found = selector in css
    status = 'OK' if found else 'FAIL'
    if not found:
        all_ok = False
    print(f'  [{status}] {label}')

with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_checks = [
    ('initScrollTop', 'initScrollTop function defined'),
    ('initScrollTop();', 'initScrollTop called in init'),
    ('classList.add("visible")', 'Add visible class'),
    ('classList.remove("visible")', 'Remove visible class'),
    ('window.scrollY > 300', 'Threshold 300px'),
    ('smooth', 'Smooth scroll'),
]

print()
print('=== JS Checks ===')
for token, label in js_checks:
    found = token in js
    status = 'OK' if found else 'FAIL'
    if not found:
        all_ok = False
    print(f'  [{status}] {label}')

print()
print('ALL CHECKS PASSED' if all_ok else 'SOME CHECKS FAILED')
