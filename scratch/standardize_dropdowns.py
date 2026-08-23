import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ['404.html', 'coming-soon.html']]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    is_home_1 = (filename == 'index.html')
    is_home_2 = (filename == 'home-2.html')

    item1_active = ' active' if is_home_1 else ''
    item2_active = ' active' if is_home_2 else ''

    standard_dropdown = f'''                    <li class="dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Home <i class="fas fa-chevron-down ms-1"></i></a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item{item1_active}" href="index.html">Home 1</a></li>
                            <li><a class="dropdown-item{item2_active}" href="home-2.html">Home 2</a></li>
                        </ul>
                    </li>'''

    pattern = re.compile(r'<li\s+class="dropdown">[\s\S]*?</li>', re.IGNORECASE)
    if pattern.search(content):
        new_content = pattern.sub(standard_dropdown, content, count=1)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Standardized dropdown in {filename}")
    else:
        print(f"Skipped {filename}")
