import shutil
import os

shutil.copy("scratch/acrylfarbset.jpg", "images/product-acrylic-paint-set.jpg")
shutil.copy("scratch/love_of_calligraphy.jpg", "images/product-calligraphy-pen-set.jpg")

print("Copied images/product-acrylic-paint-set.jpg:", os.path.getsize("images/product-acrylic-paint-set.jpg"), "bytes")
print("Copied images/product-calligraphy-pen-set.jpg:", os.path.getsize("images/product-calligraphy-pen-set.jpg"), "bytes")
