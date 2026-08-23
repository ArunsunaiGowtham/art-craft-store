import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

urls = re.findall(r'https://images\.unsplash\.com/photo-[^"\'\s]+', text)
print(f"Total Unsplash URLs in index.html: {len(urls)}")
for u in sorted(set(urls)):
    print(u)
