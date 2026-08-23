import os
import shutil

# 1. Product #8: Modeling Clay Super Pack (Multi-colored modeling clay bars)
shutil.copy("scratch/test_prod_mod_5.jpg", "images/product-modeling-clay-pack.jpg")
print("Saved images/product-modeling-clay-pack.jpg:", os.path.getsize("images/product-modeling-clay-pack.jpg"), "bytes")

# 2. Product #27: Air Dry Clay 10 Pack (Air dry clay color pack)
shutil.copy("scratch/test_prod_air_1.jpg", "images/product-air-dry-clay-pack.jpg")
print("Saved images/product-air-dry-clay-pack.jpg:", os.path.getsize("images/product-air-dry-clay-pack.jpg"), "bytes")

# 3. Product #35: Premo Polymer Clay 30-Color Multipack (Sculpey polymer clay multipack)
shutil.copy("scratch/test_prod_sculpey_5.jpg", "images/product-sculpey-polymer-clay.jpg")
print("Saved images/product-sculpey-polymer-clay.jpg:", os.path.getsize("images/product-sculpey-polymer-clay.jpg"), "bytes")
