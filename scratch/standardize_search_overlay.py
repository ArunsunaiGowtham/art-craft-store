import glob
import re

standard_search_overlay = '''  <!-- ==================== SEARCH OVERLAY ==================== -->
  <div class="search-overlay" style="display:none;">
    <div class="search-overlay-content">
      <div class="search-input-wrap">
        <i class="fas fa-search" style="font-size:1.1rem;color:var(--text-muted);"></i>
        <input type="text" class="form-control" placeholder="Search for art supplies, brands, workshops..." id="overlay-search-input">
        <button class="search-overlay-close search-close" aria-label="Close search">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="search-suggestions" id="search-suggestions">
        <h6>Popular Searches</h6>
        <div class="d-flex flex-wrap gap-2">
          <a href="shop.html?category=painting" class="badge bg-light text-dark text-decoration-none p-2">Watercolor</a>
          <a href="shop.html?category=sketching" class="badge bg-light text-dark text-decoration-none p-2">Pencils</a>
          <a href="shop.html?category=crafting" class="badge bg-light text-dark text-decoration-none p-2">Clay</a>
          <a href="workshops.html" class="badge bg-light text-dark text-decoration-none p-2">Workshops</a>
        </div>
      </div>
    </div>
  </div>'''

pattern = re.compile(r'<!--\s*=*\s*SEARCH OVERLAY\s*=*\s*-->[\s\S]*?(?:</div>\s*</div>\s*</div>|</div>\s*</div>|</div>\s*</header>|</div>\s*<section|</div>\s*<!--\s*BREADCRUMB|</div>\s*<!--\s*=*\s*PAGE)', re.IGNORECASE)

files = glob.glob('*.html')
print(f"Standardizing search overlay in {len(files)} HTML files...\n")

for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Check if search overlay exists
    if '<div class="search-overlay"' in content or '<!-- SEARCH OVERLAY' in content or '<!-- ==================== SEARCH OVERLAY' in content:
        # Replace the entire search-overlay div
        # Find start of search overlay
        start_idx = content.find('<div class="search-overlay"')
        if start_idx != -1:
            # Also find if there is a comment right before it
            comment_start = content.rfind('<!--', 0, start_idx)
            if comment_start != -1 and 'SEARCH OVERLAY' in content[comment_start:start_idx]:
                replace_start = comment_start
            else:
                replace_start = start_idx
            
            # Find the end of search overlay (before breadcrumb, hero, or next section)
            # Find matching </div> or next major comment / section
            next_marker = re.search(r'(\n\s*<!-- =* (?:BREADCRUMB|PAGE HERO|HERO|PAGE HEADER|MAIN CONTENT|SHOP FILTERS|SIGN IN|CREATE ACCOUNT|CHECKOUT|PRICING|ABOUT|BLOG|BRAND|CONTACT|FEATURED)|\n\s*<section|\n\s*<main)', content[replace_start:])
            if next_marker:
                replace_end = replace_start + next_marker.start()
                new_content = content[:replace_start] + standard_search_overlay + '\n\n' + content[replace_end:].lstrip('\n')
                with open(f, 'w', encoding='utf-8') as fh:
                    fh.write(new_content)
                print(f"Updated {f}")
            else:
                print(f"Could not find next marker in {f}")
        else:
            print(f"No search-overlay class found in {f}")
    else:
        print(f"Skipping {f} (no search overlay)")
