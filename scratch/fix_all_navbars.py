import os
import re

html_files = [
    'index.html', 'home-2.html', 'shop.html', 'product-details.html',
    'workshops.html', 'workshop-details.html', 'brands.html', 'about.html',
    'blog.html', 'blog-details.html', 'pricing.html', 'contact.html',
    'cart.html', 'checkout.html', 'login.html', 'register.html', 'student-supplies.html'
]

def get_clean_navbar(filename):
    is_home_1 = (filename == 'index.html')
    is_home_2 = (filename == 'home-2.html')
    is_shop = (filename in ['shop.html', 'product-details.html'])
    is_workshops = (filename in ['workshops.html', 'workshop-details.html'])
    is_brands = (filename == 'brands.html')
    is_about = (filename == 'about.html')
    is_blog = (filename in ['blog.html', 'blog-details.html'])
    is_pricing = (filename == 'pricing.html')
    is_contact = (filename == 'contact.html')

    home_active = ' active' if (is_home_1 or is_home_2) else ''
    item1_active = ' active' if is_home_1 else ''
    item2_active = ' active' if is_home_2 else ''
    shop_active = ' active' if is_shop else ''
    workshops_active = ' active' if is_workshops else ''
    brands_active = ' active' if is_brands else ''
    about_active = ' active' if is_about else ''
    blog_active = ' active' if is_blog else ''
    pricing_active = ' active' if is_pricing else ''
    contact_active = ' active' if is_contact else ''

    return f'''    <!-- ==================== NAVBAR ==================== -->
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <span class="logo-icon"><i class="fas fa-palette"></i></span>
                <span class="logo-text">ArtCraft</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>

            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav">
                    <li class="dropdown">
                        <a class="nav-link dropdown-toggle{home_active}" href="#" data-bs-toggle="dropdown" aria-expanded="false">Home <i class="fas fa-chevron-down ms-1"></i></a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item{item1_active}" href="index.html">Home 1</a></li>
                            <li><a class="dropdown-item{item2_active}" href="home-2.html">Home 2</a></li>
                        </ul>
                    </li>
                    <li><a class="nav-link{shop_active}" href="shop.html">Shop</a></li>
                    <li><a class="nav-link{workshops_active}" href="workshops.html">Workshops</a></li>
                    <li><a class="nav-link{brands_active}" href="brands.html">Brands</a></li>
                    <li><a class="nav-link{about_active}" href="about.html">About</a></li>
                    <li><a class="nav-link{blog_active}" href="blog.html">Blog</a></li>
                    <li><a class="nav-link{pricing_active}" href="pricing.html">Pricing</a></li>
                    <li><a class="nav-link{contact_active}" href="contact.html">Contact</a></li>
                </ul>
                <div class="nav-icons">
                    <a href="shop.html" class="nav-icon-btn" aria-label="Wishlist"><i class="far fa-heart"></i><span class="cart-badge wishlist-count" style="display:none">0</span></a>
                    <a href="cart.html" class="nav-icon-btn" aria-label="Cart"><i class="fas fa-shopping-bag"></i><span class="cart-badge cart-count" style="display:none">0</span></a>
                    <button class="nav-icon-btn theme-toggle" aria-label="Toggle theme"><i class="fas fa-moon"></i></button>
                    <button class="nav-icon-btn rtl-toggle" aria-label="Toggle RTL"><span>RTL</span></button>
                </div>
            </div>
        </div>
    </nav>'''

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace everything from <!-- ==================== NAVBAR ==================== --> or <nav class="navbar ... until </nav>
    pattern = re.compile(r'(?:<!--\s*={3,}\s*NAVBAR\s*={3,}\s*-->\s*)?<nav\s+class="navbar[\s\S]*?</nav>', re.IGNORECASE)
    
    clean_nav = get_clean_navbar(filename)
    new_content, count = pattern.subn(clean_nav, content, count=1)
    if count > 0:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed navbar in {filename}")
    else:
        print(f"FAILED to match navbar in {filename}")
