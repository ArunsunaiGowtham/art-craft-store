import urllib.request
import re
import glob

customers = {
    "Emily Rodriguez (Professional Artist)": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    "James Thompson (Art Teacher)": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    "Sarah Kim (Hobby Crafter)": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80"
}

all_files = glob.glob('**/*.html', recursive=True) + ['js/data.js']
print("Verifying 3 Customer Profile Images:\n")

for name, url in customers.items():
    m = re.search(r'photo-([a-zA-Z0-9_-]+)', url)
    pid = m.group(1) if m else url
    
    # Check HTTP status
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as resp:
            status = resp.getcode()
            print(f"PASS ({status}): {name} -> {url}")
    except Exception as e:
        print(f"FAIL: {name} -> {e}")

    # Check for duplicates in codebase
    found_in = []
    for f in all_files:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            content = fh.read()
            if pid in content:
                found_in.append(f)
    print(f"  Existing occurrences in codebase: {len(found_in)} ({', '.join(found_in) if found_in else 'None - 100% Unique'})\n")
