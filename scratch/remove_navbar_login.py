import re
import glob

html_files = glob.glob("*.html")
print(f"Found {len(html_files)} HTML files")

pattern = re.compile(r'\s*<div class="auth-container">[\s\S]*?</div>', re.MULTILINE)

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content, count = pattern.subn("", content)
    if count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}: removed {count} auth-container instance(s)")
    else:
        print(f"No auth-container found in {file_path}")

