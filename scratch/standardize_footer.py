import os, re, glob

standard_col3_col4 = '''                <!-- Col 3: Quick Links -->
                <div>
                    <h5>Quick Links</h5>
                    <div class="footer-links">
                        <a href="about.html">About Us</a>
                        <a href="blog.html">Blog</a>
                        <a href="workshops.html">Workshops</a>
                        <a href="brands.html">Brands</a>
                        <a href="contact.html">Contact Us</a>
                        <a href="pricing.html">Membership</a>
                    </div>
                </div>
                <!-- Col 4: Newsletter -->
                <div>
                    <h5>Newsletter</h5>
                    <p>Get creative tips and exclusive offers delivered to your inbox.</p>
                    <div class="footer-newsletter">
                        <form class="newsletter-form">
                            <div class="d-flex gap-0">
                                <input type="email" class="form-control" placeholder="Your email" required>
                                <button type="submit" class="btn btn-primary">Go</button>
                            </div>
                        </form>
                    </div>
                </div>'''

# Let's inspect footer structure across all HTML files
html_files = sorted(glob.glob("*.html"))
print(f"Total HTML files: {len(html_files)}")

pattern = re.compile(r'(<!-- Col 3:.*?<!-- Col 4:.*?)(?=</div>\s*</div>\s*<div class="footer-bottom"|</div>\s*<div class="footer-bottom")', re.DOTALL)

updated_count = 0
for filepath in html_files:
    if filepath in ["404.html", "coming-soon.html"]:
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Search for Col 3 and Col 4 in footer
    # Specifically replacing the support / newsletter block in footer
    if 'class="footer"' in content or 'class="footer ' in content:
        # Check if Col 3 / Col 4 match
        match = re.search(r'(<!-- Col 3:[^<]*-->.*?)(?=</div>\s*<div class="footer-bottom")', content, re.DOTALL)
        if match:
            old_block = match.group(1).rstrip()
            # Let's see if the last closing </div> for Col 4 is there
            new_block = standard_col3_col4 + "\n            "
            # Let's replace cleanly
            new_content = content[:match.start(1)] + standard_col3_col4 + "\n            </div>\n" + content[match.end(1):]
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated_count += 1
            print(f"Updated footer in {filepath}")
        else:
            print(f"Could not regex match in {filepath}")

print(f"Updated {updated_count} files.")
