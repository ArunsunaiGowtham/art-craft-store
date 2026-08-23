import re
import glob

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# Extract workshops images
workshop_matches = re.findall(r'id:\s*(\d+),\s*title:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"', data_content)

print(f"Found {len(workshop_matches)} workshops:")
for wid, title, img in workshop_matches:
    print(f"Workshop {wid}: {title}\n  Image: {img}")

# Check for duplicates across products, categories, blogPosts, hero, etc.
all_files = glob.glob('**/*.html', recursive=True) + ['js/data.js']
print("\nChecking cross-usage across repository:")
for wid, title, img in workshop_matches:
    occurrences = []
    for f in all_files:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
            content = fh.read()
            # extract photo ID
            m = re.search(r'photo-([a-zA-Z0-9_-]+)', img)
            if m:
                pid = m.group(1)
                matches_count = len(re.findall(pid, content))
                if matches_count > 0:
                    occurrences.append(f"{f} ({matches_count}x)")
    print(f"Workshop {wid} ({title}):\n  -> {', '.join(occurrences)}")
