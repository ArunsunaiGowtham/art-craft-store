import glob
import re

stay_creative_pages = [
    'about.html',
    'blog.html',
    'blog-details.html',
    'brands.html',
    'cart.html',
    'checkout.html',
    'contact.html',
    'home-2.html',
    'index.html',
    'login.html',
    'pricing.html',
    'register.html'
]

replacement_form = '''                <form class="newsletter-form" style="max-width:480px; margin:0 auto;" novalidate>
                    <div class="newsletter-input-wrap">
                        <input type="email" class="form-control" placeholder="Enter your email" required>
                    </div>
                    <button type="submit" class="btn btn-accent">Subscribe</button>
                </form>'''

for filename in stay_creative_pages:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the newsletter form inside the Stay Creative section
    # First, let's find the section
    pattern = re.compile(r'(<section[^>]*style="[^"]*linear-gradient[^"]*"[^>]*>[\s\S]*?<h2[^>]*>Stay Creative[^<]*</h2>[\s\S]*?)(<form class="newsletter-form[^"]*"[^>]*>[\s\S]*?</form>)([\s\S]*?</section>)', re.IGNORECASE)
    
    match = pattern.search(content)
    if match:
        sec_start = match.group(1)
        # ensure class="section newsletter-section"
        if 'newsletter-section' not in sec_start:
            sec_start = re.sub(r'<section class="section"', '<section class="section newsletter-section"', sec_start)
        
        new_section = sec_start + replacement_form + match.group(3)
        content = content[:match.start()] + new_section + content[match.end():]
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No match for section in {filename}")
