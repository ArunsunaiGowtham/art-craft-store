import re
import json

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# Parse workshops
workshops = re.findall(r'id:\s*(\d+),[\s\S]*?instructor:\s*"([^"]+)",[\s\S]*?instructorAvatar:\s*"([^"]+)"', data_content)

# Parse blog posts
blog_posts = re.findall(r'id:\s*(\d+),[\s\S]*?author:\s*"([^"]+)",[\s\S]*?authorAvatar:\s*"([^"]+)"', data_content)

print("=== CHECKING WORKSHOPS INSTRUCTORS ===")
author_to_avatar = {}
avatar_to_author = {}
errors = []

for wid, instructor, avatar in workshops:
    print(f"Workshop {wid:>2}: {instructor:<18} -> {avatar}")
    
    # Check consistency for same instructor
    if instructor in author_to_avatar:
        if author_to_avatar[instructor] != avatar:
            errors.append(f"INCONSISTENCY: {instructor} has multiple avatars in workshops ({author_to_avatar[instructor]} vs {avatar})")
    else:
        author_to_avatar[instructor] = avatar
        
    # Check uniqueness across different instructors
    if avatar in avatar_to_author:
        if avatar_to_author[avatar] != instructor:
            errors.append(f"DUPLICATE AVATAR: {avatar} is shared by {avatar_to_author[avatar]} and {instructor}")
    else:
        avatar_to_author[avatar] = instructor

print("\n=== CHECKING BLOG POST AUTHORS ===")
for pid, author, avatar in blog_posts:
    print(f"Blog Post {pid:>2}: {author:<18} -> {avatar}")
    
    # Check consistency for same author across workshops and blogs
    norm_name = "Sarah Mitchell" if author == "Sarah M." else author
    if norm_name in author_to_avatar:
        if author_to_avatar[norm_name] != avatar:
            errors.append(f"INCONSISTENCY: {norm_name} has different avatar in blog ({avatar}) vs workshops ({author_to_avatar[norm_name]})")
    else:
        author_to_avatar[norm_name] = avatar

    if avatar in avatar_to_author:
        if avatar_to_author[avatar] != norm_name and avatar_to_author[avatar] != author:
            errors.append(f"DUPLICATE AVATAR: {avatar} is shared by {avatar_to_author[avatar]} and {author}")
    else:
        avatar_to_author[avatar] = norm_name

print("\n=== AUTHOR TO AVATAR MAPPING ===")
for author, avatar in sorted(author_to_avatar.items()):
    print(f"{author:<20} -> {avatar}")

# Specifically verify key authors mentioned in requirements:
specific_checks = ["Sarah Mitchell", "Emma Laurent", "Marco Rivera", "David Chen", "Lisa Park", "Yuki Tanaka", "Emily Rodriguez"]
print("\n=== SPECIFIC REQUIREMENT VERIFICATION ===")
for name in specific_checks:
    if name in author_to_avatar:
        print(f"[OK] {name:<18} -> Verified (Unique avatar: {author_to_avatar[name]})")
    else:
        errors.append(f"Missing author: {name}")

# Check about.html
with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

print("\n=== VERIFYING ABOUT.HTML TEAM CARDS ===")
team_matches = re.findall(r'<div class="team-card">[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[\s\S]*?<h5 class="team-card-name">([^<]+)</h5>', about_html)
for img, alt, name in team_matches:
    print(f"Team Member: {name:<18} -> {img}")
    # Extract base photo id
    photo_id_match = re.search(r'photo-(\d+-[a-zA-Z0-9]+)', img)
    if photo_id_match and name in author_to_avatar:
        data_avatar = author_to_avatar[name]
        data_photo_id_match = re.search(r'photo-(\d+-[a-zA-Z0-9]+)', data_avatar)
        if photo_id_match.group(1) == data_photo_id_match.group(1):
            print(f"   -> Consistent with {name}'s avatar in data.js [OK]")
        else:
            errors.append(f"About.html photo mismatch for {name}: {img} vs {data_avatar}")

if errors:
    print("\n[ERROR] ERRORS FOUND:")
    for e in errors:
        print("  -", e)
    exit(1)
else:
    print("\n=======================================================")
    print("ALL AUTHOR AVATARS ARE 100% UNIQUE & CONSISTENT!")
    print("=======================================================")
