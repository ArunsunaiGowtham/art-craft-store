import shutil
import os

shutil.copy("scratch/painting_brushes.jpg", "images/product-professional-brush-set.jpg")
shutil.copy("scratch/oil_tubes_colors.jpg", "images/product-oil-color-master-set.jpg")

print("Saved images/product-professional-brush-set.jpg:", os.path.getsize("images/product-professional-brush-set.jpg"), "bytes")
print("Saved images/product-oil-color-master-set.jpg:", os.path.getsize("images/product-oil-color-master-set.jpg"), "bytes")
