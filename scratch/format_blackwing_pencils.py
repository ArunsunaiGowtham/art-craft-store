from PIL import Image

img = Image.open("scratch/blackwing_box.jpg").convert("RGB")
w, h = img.size

# Crop tight to the open pencil box and pencil
# Let's crop from x: 0 to 1100, y: 150 to 950
cropped = img.crop((0, 150, 1100, 950))
cw, ch = cropped.size

# Place on white square canvas 800x800
target_size = 800
canvas = Image.new("RGB", (target_size, target_size), (255, 255, 255))

scale = min(760 / cw, 760 / ch)
new_w = int(cw * scale)
new_h = int(ch * scale)

resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
pos_x = (target_size - new_w) // 2
pos_y = (target_size - new_h) // 2

canvas.paste(resized, (pos_x, pos_y))

out_path = "images/product-graphite-pencil-set.jpg"
canvas.save(out_path, "JPEG", quality=95)
print(f"Saved {out_path} ({new_w}x{new_h})")
