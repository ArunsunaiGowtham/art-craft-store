import os
from PIL import Image, ImageStat

files = [
    ("plasticine_pack_1", "scratch/clay_products_flickr/plasticine_pack_1.jpg"),
    ("plasticine_pack_2", "scratch/clay_products_flickr/plasticine_pack_2.jpg"),
    ("plasticine_pack_3", "scratch/clay_products_flickr/plasticine_pack_3.jpg"),
    ("fimo_blocks_1", "scratch/clay_products_flickr/fimo_blocks_1.jpg"),
    ("fimo_blocks_4", "scratch/clay_products_flickr/fimo_blocks_4.jpg"),
    ("fimo_blocks_5", "scratch/clay_products_flickr/fimo_blocks_5.jpg"),
    ("sculpey_pack_1", "scratch/clay_products_flickr/sculpey_pack_1.jpg"),
    ("sculpey_pack_2", "scratch/clay_products_flickr/sculpey_pack_2.jpg"),
    ("sculpey_pack_4", "scratch/clay_products_flickr/sculpey_pack_4.jpg"),
    ("fimo_blocks_png", "scratch/wm_clay/Fimo_blocks.png"),
    ("earthenware_block", "scratch/clay_products_new/Block_of_mixed_earthenware_clay.JPG"),
    ("poly_examples", "scratch/wm_all_clay/Polymer_clay_examples.jpg")
]

for name, p in files:
    if os.path.exists(p):
        im = Image.open(p).convert('RGB')
        stat = ImageStat.Stat(im)
        print(f"[{name:20s}] Size: {im.size}, Bright: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}")
    else:
        print(f"[{name:20s}] MISSING")
