import os
import re

html_files = [
    'index.html', 'home-2.html', 'shop.html', 'product-details.html',
    'workshops.html', 'workshop-details.html', 'brands.html', 'about.html',
    'blog.html', 'blog-details.html', 'pricing.html', 'contact.html',
    'cart.html', 'checkout.html', 'login.html', 'register.html', 'student-supplies.html'
]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    is_home_1 = (filename == 'index.html')
    is_home_2 = (filename == 'home-2.html')

    home_active = ' active' if (is_home_1 or is_home_2) else ''
    item1_active = ' active' if is_home_1 else ''
    item2_active = ' active' if is_home_2 else ''

    dropdown_replacement = f'''                    <li class="dropdown">
                        <a class="nav-link dropdown-toggle{home_active}" href="#" data-bs-display="static" aria-expanded="false">Home <i class="fas fa-chevron-down ms-1"></i></a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item{item1_active}" href="index.html">Home 1</a></li>
                            <li><a class="dropdown-item{item2_active}" href="home-2.html">Home 2</a></li>
                        </ul>
                    </li>'''

    pattern = re.compile(r'<li\s+class="dropdown">[\s\S]*?</ul>\s*</li>', re.IGNORECASE)
    new_content, count = pattern.subn(dropdown_replacement, content, count=1)
    if count > 0:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated dropdown in {filename}")
    else:
        print(f"FAILED to update {filename}")
