import glob
import re

favicon_block = """    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="manifest" href="site.webmanifest">
    <meta name="theme-color" content="#E85D3A">"""

html_files = sorted(glob.glob("*.html"))

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # If it already has Favicon comment and link, replace it
    if re.search(r"<!--\s*Favicons?\s*-->\s*<link[^>]*href=['\"]favicon\.ico['\"][^>]*>", content, re.IGNORECASE):
        content = re.sub(
            r"<!--\s*Favicons?\s*-->\s*<link[^>]*href=['\"]favicon\.ico['\"][^>]*>",
            favicon_block,
            content,
            flags=re.IGNORECASE
        )
    elif re.search(r"<link[^>]*href=['\"]favicon\.ico['\"][^>]*>", content, re.IGNORECASE):
        content = re.sub(
            r"<link[^>]*href=['\"]favicon\.ico['\"][^>]*>",
            favicon_block,
            content,
            flags=re.IGNORECASE
        )
    elif "<!-- CSS -->" in content:
        content = content.replace("<!-- CSS -->", favicon_block + "\n\n    <!-- CSS -->")
    elif "<!-- Bootstrap CSS -->" in content:
        content = content.replace("<!-- Bootstrap CSS -->", favicon_block + "\n\n    <!-- Bootstrap CSS -->")
    elif "<link rel=\"stylesheet\"" in content or "<link href=\"https://cdn.jsdelivr.net" in content:
        # insert before first stylesheet
        match = re.search(r"(<link[^>]*rel=[\"']stylesheet[\"'][^>]*>|<link[^>]*href=[\"']https://cdn\.jsdelivr\.net[^>]*>)", content)
        if match:
            pos = match.start()
            content = content[:pos] + favicon_block + "\n\n    " + content[pos:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filepath}")
