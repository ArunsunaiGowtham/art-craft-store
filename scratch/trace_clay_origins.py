import os
import re

# Look for occurrences of these filenames across scratch/*.py and scratch/*.ps1
files = [
    'clay_1.jpg', 'clay_2.jpg', 'clay_3.jpg', 'clay_7.jpg', 'clay_9.jpg', 'clay_10.jpg', 'clay_12.jpg',
    'clay_blocks_1.jpg', 'clay_blocks_2.jpg',
    'polymer_clay_blocks.jpg', 'polymer_clay_conditioning.jpg', 'polymer_clay_super.jpg',
    'sculpey_pack_6.jpg', 'sculpey_sampler_10.jpg', 'sculpey_sampler_6.jpg', 'sculpey_sampler_9.jpg'
]

for sf in os.listdir('scratch'):
    if sf.endswith(('.py', '.js', '.ps1')):
        p = os.path.join('scratch', sf)
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for target in files:
            if target.replace('.jpg', '') in content or target in content:
                print(f"[{sf}] mentions {target}")
                for line in content.splitlines():
                    if target.replace('.jpg', '') in line or target in line:
                        print(f"    {line.strip()}")
