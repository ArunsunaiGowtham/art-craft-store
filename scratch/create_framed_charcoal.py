from PIL import Image

img = Image.open("scratch/audit/p_7_sketching.jpg").convert("RGB")
w, h = img.size

# Target 800x800 square canvas
target_size = 800
canvas = Image.new("RGB", (target_size, target_size), (255, 255, 255))

# Scale to 620px high (plenty of breathing room above and below)
max_dim = 620
scale = min(max_dim / w, max_dim / h)
new_w = int(w * scale)
new_h = int(h * scale)

resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Center it
pos_x = (target_size - new_w) // 2
pos_y = (target_size - new_h) // 2

canvas.paste(resized_img, (pos_x, pos_y))

out_path = "images/product-charcoal-drawing-set.jpg"
canvas.save(out_path, "JPEG", quality=95)
print(f"Updated {out_path} with 620px framing!")
