import urllib.request
import re
import glob

team = {
    "Sarah Mitchell": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    "David Chen": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "Lisa Park": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "Marco Rivera": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
}

print("Verifying 4 Team Member Portraits:\n")
all_files = glob.glob('**/*.html', recursive=True) + ['js/data.js']

for name, url in team.items():
    m = re.search(r'photo-([a-zA-Z0-9_-]+)', url)
    pid = m.group(1) if m else url
    
    # Check HTTP
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as resp:
            status = resp.getcode()
            print(f"PASS ({status}): {name} -> {url}")
    except Exception as e:
        print(f"FAIL: {name} -> {e}")

    # Check cross usage in HTML/JS
    count = 0
    found_in = []
    for f in all_files:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            content = fh.read()
            if pid in content:
                found_in.append(f)
    print(f"  Existing occurrences in codebase: {len(found_in)} ({', '.join(found_in) if found_in else 'None - 100% Unique'})\n")
