import glob, re

standard_footer = '''        <div class="container">
            <div class="footer-grid">
                <!-- Col 1: About -->
                <div>
                    <h5><i class="fas fa-palette me-2"></i>ArtCraft</h5>
                    <p>Your premier destination for art supplies, creative workshops, and artistic inspiration. Fueling creativity since 2010.</p>
                    <div class="footer-social">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>
                </div>
                <!-- Col 2: Shop -->
                <div>
                    <h5>Shop</h5>
                    <div class="footer-links">
                        <a href="shop.html">All Products</a>
                        <a href="shop.html?category=painting">Painting</a>
                        <a href="shop.html?category=sketching">Drawing &amp; Sketching</a>
                        <a href="shop.html?category=crafting">Crafting</a>
                        <a href="student-supplies.html">Student Supplies</a>
                        <a href="shop.html?category=art-tools">Art Tools</a>
                        <a href="pricing.html">Membership</a>
                    </div>
                </div>
                <!-- Col 3: Quick Links -->
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
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 ArtCraft Supply Store. All rights reserved.</p>
            </div>
        </div>'''

for filepath in sorted(glob.glob("*.html")):
    if filepath in ["404.html", "coming-soon.html"]:
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace everything inside <footer ...> ... </footer>
    new_content = re.sub(
        r'(<footer\b[^>]*>).*?(</footer>)',
        r'\1\n' + standard_footer + r'\n\2',
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Standardized full footer in {filepath}")
