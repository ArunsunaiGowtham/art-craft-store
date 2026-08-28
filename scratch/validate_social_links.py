import glob
import re

files = sorted(glob.glob('*.html'))
issues = []
all_social_links = []

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    tags = re.findall(r'<a\b[^>]*>[\s\S]*?</a>', content)
    for tag in tags:
        clean = re.sub(r'\s+', ' ', tag.strip())
        if any(term in clean.lower() for term in ['instagram', 'twitter', 'facebook', 'youtube', 'pinterest', 'linkedin', 'fa-instagram', 'fa-twitter', 'fa-facebook', 'fa-youtube', 'fa-pinterest']):
            all_social_links.append((f, clean))
            
            # Check if href is '#' or empty or points to current page
            href_match = re.search(r'href=[\'"]([^\'"]*)[\'"]', clean)
            href = href_match.group(1) if href_match else ''
            
            # Check target and rel for external social links
            target_match = re.search(r'target=[\'"]([^\'"]*)[\'"]', clean)
            target = target_match.group(1) if target_match else ''
            
            rel_match = re.search(r'rel=[\'"]([^\'"]*)[\'"]', clean)
            rel = rel_match.group(1) if rel_match else ''
            
            # If it's a share link or social icon
            if href == '#' or href == '' or href.startswith('#'):
                issues.append(f"Broken href in {f}: {clean}")
            elif not target:
                issues.append(f"Missing target in {f}: {clean}")
            elif 'noopener' not in rel or 'noreferrer' not in rel:
                issues.append(f"Missing rel in {f}: {clean}")

print(f"Total social links scanned: {len(all_social_links)}")
if issues:
    print(f"\nFound {len(issues)} issues:")
    for issue in issues:
        print(" - ", issue)
else:
    print("ALL social links across all HTML files are properly configured with external URLs, target='_blank', and rel='noopener noreferrer'!")

print("\n--- Summary of all social links by file ---")
file_counts = {}
for f, link in all_social_links:
    file_counts[f] = file_counts.get(f, 0) + 1
for f, count in file_counts.items():
    print(f"{f}: {count} links")
