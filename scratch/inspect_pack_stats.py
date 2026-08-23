import os
from PIL import Image, ImageStat

files = [
    ("Modeling Clay (mod_5)", "scratch/test_prod_mod_5.jpg"),
    ("Modeling Clay (mod_2)", "scratch/test_prod_mod_2.jpg"),
    ("Plasticine (plast_3)", "scratch/test_prod_plast_3.jpg"),
    ("Air Dry Clay (air_1)", "scratch/test_prod_air_1.jpg"),
    ("Earthenware (earthen)", "scratch/test_prod_earthen.jpg"),
    ("Sculpey Pack (sculpey_5)", "scratch/test_prod_sculpey_5.jpg"),
    ("Sculpey Pack (sculpey_4)", "scratch/test_prod_sculpey_4.jpg"),
    ("Fimo Blocks (fimo_5)", "scratch/test_prod_fimo_5.jpg"),
    ("Polymer Pack (poly_1)", "scratch/test_prod_poly_1.jpg")
]

for label, p in files:
    im = Image.open(p).convert('RGB')
    stat = ImageStat.Stat(im)
    print(f"[{label:25s}] Brightness: {sum(stat.mean)/3:.1f}, Contrast: {sum(stat.stddev)/3:.1f}, RGB Spread: {max(stat.mean)-min(stat.mean):.1f}")
