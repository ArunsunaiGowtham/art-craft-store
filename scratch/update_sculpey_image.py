import shutil
import os

# Save unique polymer clay image
shutil.copy("scratch/polymer_clay_examples.jpg", "images/product-sculpey-polymer-clay.jpg")
print("Saved images/product-sculpey-polymer-clay.jpg with unique polymer clay blocks image!")
print("File size:", os.path.getsize("images/product-sculpey-polymer-clay.jpg"), "bytes")
