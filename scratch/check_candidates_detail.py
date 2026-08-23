import os
from PIL import Image

# Let's inspect the files in scratch
files = {
    "Polymer Clay (Polymer_clay_examples.jpg)": "scratch/wm_all_clay/Polymer_clay_examples.jpg",
    "Fimo Blocks (Fimo_blocks.png)": "scratch/wm_all_clay/Fimo_blocks.png",
    "Modeling Clay 5 (modeling_clay_5.jpg)": "scratch/flickr_clay/modeling_clay_5.jpg",
    "Polymer Clay 3 (polymer_clay_3.jpg)": "scratch/flickr_clay/polymer_clay_3.jpg",
    "Polymer Clay 4 (polymer_clay_4.jpg)": "scratch/flickr_clay/polymer_clay_4.jpg",
    "Polymer Clay 5 (polymer_clay_5.jpg)": "scratch/flickr_clay/polymer_clay_5.jpg",
    "Pottery Clay 5 (pottery_clay_5.jpg)": "scratch/flickr_clay/pottery_clay_5.jpg",
    "Air Dry Clay 1 (air_dry_clay_1.jpg)": "scratch/flickr_clay/air_dry_clay_1.jpg",
    "Clay 12 (clay_12.jpg)": "scratch/clay_12.jpg",
    "Clay 7 (clay_7.jpg)": "scratch/clay_7.jpg",
    "Clay 9 (clay_9.jpg)": "scratch/clay_9.jpg",
    "Sculpey Sampler 9 (sculpey_sampler_9.jpg)": "scratch/sculpey_sampler_9.jpg"
}

for label, p in files.items():
    if os.path.exists(p):
        im = Image.open(p)
        print(f"[{label}] -> Size: {im.size}, Mode: {im.mode}")
    else:
        print(f"[{label}] -> NOT FOUND")
