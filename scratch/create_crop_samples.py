import os
from PIL import Image

def get_crop(img_path, target_ratio=4/3):
    im = Image.open(img_path).convert('RGB')
    w, h = im.size
    curr_ratio = w / h
    if curr_ratio > target_ratio:
        # crop width
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        im_crop = im.crop((offset, 0, offset + new_w, h))
    else:
        # crop height
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        im_crop = im.crop((0, offset, w, offset + new_h))
    return im_crop.resize((800, 600), Image.LANCZOS)

# Let's inspect some of our top candidates:
candidates = [
    # Modeling clay
    ("mod_flickr_2", "scratch/flickr_clay/modeling_clay_2.jpg"),
    ("mod_flickr_5", "scratch/flickr_clay/modeling_clay_5.jpg"),
    ("mod_flickr_3", "scratch/flickr_clay/modeling_clay_3.jpg"),
    ("mod_clay_7", "scratch/clay_7.jpg"),
    ("mod_clay_9", "scratch/clay_9.jpg"),
    ("mod_sculpey_9", "scratch/sculpey_sampler_9.jpg"),
    
    # Air Dry Clay
    ("air_flickr_1", "scratch/flickr_clay/air_dry_clay_1.jpg"),
    ("air_flickr_2", "scratch/flickr_clay/air_dry_clay_2.jpg"),
    ("air_pottery_2", "scratch/flickr_clay/pottery_clay_2.jpg"),
    ("air_pottery_5", "scratch/flickr_clay/pottery_clay_5.jpg"),
    ("air_clay_12", "scratch/clay_12.jpg"),
    ("air_clay_3", "scratch/clay_3.jpg"),
    
    # Polymer clay
    ("poly_flickr_3", "scratch/flickr_clay/polymer_clay_3.jpg"),
    ("poly_flickr_4", "scratch/flickr_clay/polymer_clay_4.jpg"),
    ("poly_flickr_5", "scratch/flickr_clay/polymer_clay_5.jpg"),
    ("poly_wm_examples", "scratch/wm_all_clay/Polymer_clay_examples.jpg"),
    ("poly_fimo_blocks", "scratch/wm_all_clay/Fimo_blocks.png"),
    ("poly_sculpey_6", "scratch/sculpey_pack_6.jpg")
]

os.makedirs('scratch/crop_samples', exist_ok=True)

for name, path in candidates:
    if os.path.exists(path):
        out = f"scratch/crop_samples/{name}.jpg"
        crop = get_crop(path)
        crop.save(out, "JPEG", quality=90)
        print(f"Saved {name} -> {out}")
    else:
        print(f"Missing {path}")
