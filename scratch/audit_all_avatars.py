import re
import os

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# 1. Workshops
print("=== WORKSHOPS INSTRUCTORS ===")
workshops = re.findall(r'id:\s*(\d+),[\s\S]*?instructor:\s*"([^"]+)",[\s\S]*?instructorAvatar:\s*"([^"]+)"', data_content)
for wid, name, avatar in workshops:
    print(f"Workshop {wid:>2}: {name:<20} -> {avatar}")

# 2. Blog Posts
print("\n=== BLOG POST AUTHORS ===")
blog_posts = re.findall(r'id:\s*(\d+),[\s\S]*?author:\s*"([^"]+)",[\s\S]*?authorAvatar:\s*"([^"]+)"', data_content)
for pid, name, avatar in blog_posts:
    print(f"Blog Post {pid:>2}: {name:<20} -> {avatar}")

# 3. Team Members in data.js
print("\n=== TEAM MEMBERS IN DATA.JS ===")
team = re.findall(r'name:\s*"([^"]+)",[\s\S]*?role:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"', data_content)
for name, role, image in team:
    print(f"Team: {name:<20} ({role:<20}) -> {image}")

# 4. Testimonials in data.js
print("\n=== TESTIMONIALS IN DATA.JS ===")
testimonials = re.findall(r'name:\s*"([^"]+)",[\s\S]*?role:\s*"([^"]+)",[\s\S]*?avatar:\s*"([^"]+)"', data_content)
for name, role, avatar in testimonials:
    print(f"Testimonial: {name:<20} ({role:<20}) -> {avatar}")

# Check HTML files for hardcoded authors or team members
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print("\n=== HARDCODED AVATARS / AUTHORS IN HTML FILES ===")
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        html = f.read()
    # Find img tags with alt matching author/instructor/team or in author/instructor/team blocks
    matches = re.findall(r'<img[^>]+(?:avatar|instructor|author|team|testimonial)[^>]*>', html, re.IGNORECASE)
    if matches:
        print(f"\nIn {hf}:")
        for m in matches:
            print("  ", m)
