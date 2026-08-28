import glob
import re
import sys

html_files = sorted(glob.glob('*.html'))
passed = 0
failed = 0
errors = []

expected_urls = {
    'instagram': 'https://www.instagram.com/',
    'twitter': ['https://x.com/', 'https://twitter.com/'],
    'facebook': 'https://www.facebook.com/',
    'youtube': 'https://www.youtube.com/',
    'pinterest': 'https://www.pinterest.com/',
    'linkedin': 'https://www.linkedin.com/'
}

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all <a> tags
    tags = re.findall(r'<a\b[^>]*>[\s\S]*?</a>', content)
    for tag in tags:
        clean = re.sub(r'\s+', ' ', tag.strip())
        is_social = False
        social_network = None
        
        for net in ['instagram', 'twitter', 'facebook', 'youtube', 'pinterest', 'linkedin']:
            if net in clean.lower() or f'fa-{net}' in clean.lower() or (net == 'twitter' and 'fa-x-twitter' in clean.lower()):
                is_social = True
                social_network = net
                break
        
        if is_social:
            href_m = re.search(r'href=[\'"]([^\'"]*)[\'"]', clean)
            href = href_m.group(1) if href_m else ''
            
            target_m = re.search(r'target=[\'"]([^\'"]*)[\'"]', clean)
            target = target_m.group(1) if target_m else ''
            
            rel_m = re.search(r'rel=[\'"]([^\'"]*)[\'"]', clean)
            rel = rel_m.group(1) if rel_m else ''
            
            # Check for href='#'
            if href == '#' or href.startswith('#') or href == '':
                failed += 1
                errors.append(f"[{filepath}] Social link has empty/hash href: {clean}")
                continue
                
            # Check for target="_blank"
            if target != '_blank':
                failed += 1
                errors.append(f"[{filepath}] Social link missing target='_blank': {clean}")
                continue
                
            # Check for rel="noopener noreferrer"
            if 'noopener' not in rel or 'noreferrer' not in rel:
                failed += 1
                errors.append(f"[{filepath}] Social link missing rel='noopener noreferrer': {clean}")
                continue
                
            # Check URL match
            expected = expected_urls.get(social_network)
            if isinstance(expected, list):
                if not any(exp in href for exp in expected):
                    failed += 1
                    errors.append(f"[{filepath}] Unexpected URL '{href}' for {social_network}: {clean}")
                    continue
            elif isinstance(expected, str):
                if expected not in href:
                    failed += 1
                    errors.append(f"[{filepath}] Unexpected URL '{href}' for {social_network}: {clean}")
                    continue
            
            passed += 1

print(f"Social Links Test Results:")
print(f"Passed: {passed}")
print(f"Failed: {failed}")

if errors:
    print("\nErrors:")
    for err in errors:
        print("  - ", err)
    sys.exit(1)
else:
    print("\nAll social links are 100% valid and conform to requirements!")
