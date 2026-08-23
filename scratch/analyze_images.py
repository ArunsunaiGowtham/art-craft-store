import os
from PIL import Image, ImageStat

def analyze_image(path):
    im = Image.open(path).convert('RGB')
    stat = ImageStat.Stat(im)
    mean_rgb = stat.mean
    std_rgb = stat.stddev
    # Color variance
    color_var = max(mean_rgb) - min(mean_rgb)
    return {
        'size': im.size,
        'aspect': round(im.size[0] / im.size[1], 2),
        'mean_brightness': round(sum(mean_rgb) / 3, 1),
        'contrast': round(sum(std_rgb) / 3, 1),
        'color_spread': round(color_var, 1)
    }

folders = ['scratch/flickr_clay', 'scratch/wm_all_clay', 'scratch']

for f in folders:
    print(f"\n=== Folder: {f} ===")
    for item in sorted(os.listdir(f)):
        if item.endswith(('.jpg', '.png', '.JPG', '.PNG')) and any(k in item.lower() for k in ['clay', 'fimo', 'sculpey', 'model', 'potter']):
            p = os.path.join(f, item)
            try:
                res = analyze_image(p)
                print(f"  {item:35s}: {res['size']}, aspect={res['aspect']}, bright={res['mean_brightness']}, contrast={res['contrast']}, spread={res['color_spread']}")
            except Exception as e:
                pass
