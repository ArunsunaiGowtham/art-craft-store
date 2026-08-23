import glob
import re

TARGET_FOOTER_SOCIAL = '''<div class="footer-social">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>'''

updated_files = []

for html_path in sorted(glob.glob('*.html')):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(
        r'<div class="footer-social">[\s\S]*?</div>',
        TARGET_FOOTER_SOCIAL,
        content
    )

    if html_path == 'coming-soon.html':
        old_cs_social = re.search(r'<!-- Social links -->\s*<div class="d-flex gap-3 justify-content-center">[\s\S]*?</div>', new_content)
        if old_cs_social:
            new_cs_social = '''<!-- Social links -->
        <div class="d-flex gap-3 justify-content-center">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border-color);color:var(--text-secondary);transition:all 0.2s;"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border-color);color:var(--text-secondary);transition:all 0.2s;"><i class="fab fa-instagram"></i></a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border-color);color:var(--text-secondary);transition:all 0.2s;"><i class="fab fa-twitter"></i></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border-color);color:var(--text-secondary);transition:all 0.2s;"><i class="fab fa-youtube"></i></a>
            <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border-color);color:var(--text-secondary);transition:all 0.2s;"><i class="fab fa-pinterest"></i></a>
        </div>'''
            new_content = new_content.replace(old_cs_social.group(0), new_cs_social)

    if new_content != content:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated_files.append(html_path)

print(f"Successfully updated {len(updated_files)} files:")
for f in updated_files:
    print(f" - {f}")
