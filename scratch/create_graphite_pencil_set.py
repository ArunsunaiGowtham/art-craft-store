from PIL import Image

img = Image.open("scratch/blackwing_box.jpg").convert("RGB")
w, h = img.size
print(f"Original image size: {w}x{h}")

target_size = 800
canvas = Image.new("RGB", (target_size, target_size), (255, 255, 255))

max_dim = 700
scale = min(max_dim / w, max_dim / h)
new_w = int(w * scale)
new_h = int(h * scale)

resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
pos_x = (target_size - new_w) // 2
pos_y = (target_size - new_h) // 2

canvas.paste(resized, (pos_x, pos_y))

out_path = "images/product-graphite-pencil-set.jpg"
canvas.save(out_path, "JPEG", quality=95)
print(f"Saved {out_path} ({new_w}x{new_h} inside {target_size}x{target_size})")
