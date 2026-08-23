from PIL import Image

img = Image.open("scratch/blackwing_box.jpg").convert("RGB")

# Crop tight around box and pencils
crop_box = (100, 100, 1180, 960)
cropped = img.crop(crop_box)
cw, ch = cropped.size

# Sample background color near bottom-right of original photo
bg_color = cropped.getpixel((cw - 20, ch - 20))
print("Sampled background color:", bg_color)

target_size = 800
canvas = Image.new("RGB", (target_size, target_size), bg_color)

scale = min(740 / cw, 740 / ch)
new_w = int(cw * scale)
new_h = int(ch * scale)

resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
pos_x = (target_size - new_w) // 2
pos_y = (target_size - new_h) // 2

canvas.paste(resized, (pos_x, pos_y))

out_path = "images/product-graphite-pencil-set.jpg"
canvas.save(out_path, "JPEG", quality=95)
print(f"Saved {out_path}!")
