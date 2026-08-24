import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_svg():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#1a1a2e" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <!-- Palette Glow / Gradient -->
    <linearGradient id="paletteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FDF8F5" />
      <stop offset="100%" stop-color="#F3E5D8" />
    </linearGradient>

    <!-- Brush Handle Gradient -->
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B4513" />
      <stop offset="50%" stop-color="#A0522D" />
      <stop offset="100%" stop-color="#CD853F" />
    </linearGradient>

    <!-- Ferrule Gradient -->
    <linearGradient id="ferruleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="50%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Bristles Gradient -->
    <linearGradient id="bristleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E85D3A" />
      <stop offset="60%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#C2410C" />
    </linearGradient>

    <!-- Shadow filter -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base Squircle with vibrant border -->
  <rect x="24" y="24" width="464" height="464" rx="108" fill="url(#bgGrad)" stroke="#E85D3A" stroke-width="8" stroke-opacity="0.6"/>

  <!-- Subtle inner radial ambient light -->
  <circle cx="256" cy="256" r="200" fill="#E85D3A" opacity="0.08" filter="url(#softGlow)"/>

  <!-- Palette Body -->
  <g filter="url(#dropShadow)">
    <path d="M 210,105 
             C 325,105 400,165 400,265 
             C 400,320 370,365 330,375 
             C 300,382 280,360 265,340 
             C 252,323 235,315 210,320 
             C 165,330 145,370 120,385 
             C 95,400 65,370 65,320 
             C 65,190 125,105 210,105 Z" 
          fill="url(#paletteGrad)" 
          stroke="#E0DDD8" 
          stroke-width="4"/>
    
    <!-- Thumb Hole -->
    <ellipse cx="140" cy="315" rx="22" ry="28" transform="rotate(-25 140 315)" fill="#1A1A2E" stroke="#C9C2B8" stroke-width="3"/>
  </g>

  <!-- Paint Swatches / Color Blobs on Palette -->
  <!-- Coral / Red Spot -->
  <circle cx="155" cy="175" r="24" fill="#E85D3A" filter="url(#softGlow)"/>
  <circle cx="150" cy="170" r="8" fill="#FF8A65" opacity="0.8"/>

  <!-- Gold / Amber Spot -->
  <circle cx="225" cy="145" r="23" fill="#F4A825" filter="url(#softGlow)"/>
  <circle cx="220" cy="140" r="7.5" fill="#FDE047" opacity="0.8"/>

  <!-- Emerald Spot -->
  <circle cx="295" cy="160" r="23" fill="#10B981" filter="url(#softGlow)"/>
  <circle cx="290" cy="155" r="7.5" fill="#6EE7B7" opacity="0.8"/>

  <!-- Royal Blue Spot -->
  <circle cx="345" cy="215" r="24" fill="#3A7BDE" filter="url(#softGlow)"/>
  <circle cx="340" cy="210" r="8" fill="#93C5FD" opacity="0.8"/>

  <!-- Purple Spot -->
  <circle cx="340" cy="290" r="21" fill="#8B5CF6" filter="url(#softGlow)"/>
  <circle cx="336" cy="286" r="7" fill="#C4B5FD" opacity="0.8"/>

  <!-- Dynamic Artist Paint Brush crossing through -->
  <g filter="url(#dropShadow)" transform="rotate(-42 320 280)">
    <!-- Brush Wooden Handle -->
    <path d="M 314,80 L 326,80 L 324,310 L 316,310 Z" fill="url(#handleGrad)"/>
    <circle cx="320" cy="80" r="6" fill="#8B4513"/>

    <!-- Metallic Ferrule -->
    <rect x="313" y="310" width="14" height="40" rx="3" fill="url(#ferruleGrad)" stroke="#64748B" stroke-width="1.5"/>
    <line x1="313" y1="324" x2="327" y2="324" stroke="#475569" stroke-width="1.5"/>
    <line x1="313" y1="334" x2="327" y2="334" stroke="#475569" stroke-width="1.5"/>

    <!-- Bristles with fresh paint tip -->
    <path d="M 313,350 C 313,375 310,395 320,410 C 330,395 327,375 327,350 Z" fill="url(#bristleGrad)"/>
    <path d="M 317,385 C 318,398 320,410 320,410 C 320,410 322,398 323,385 Z" fill="#FF8A65" opacity="0.9"/>
  </g>

  <!-- Sparkling / Creative Star accent -->
  <g transform="translate(370, 95) scale(0.9)">
    <path d="M 20,0 Q 20,20 40,20 Q 20,20 20,40 Q 20,20 0,20 Q 20,20 20,0 Z" fill="#F4A825"/>
    <circle cx="20" cy="20" r="4" fill="#FFFFFF"/>
  </g>
  <g transform="translate(85, 390) scale(0.65)">
    <path d="M 20,0 Q 20,20 40,20 Q 20,20 20,40 Q 20,20 0,20 Q 20,20 20,0 Z" fill="#E85D3A"/>
    <circle cx="20" cy="20" r="4" fill="#FFFFFF"/>
  </g>
</svg>"""
    return svg_content

def draw_icon(size):
    # Render crisp icon at given resolution using supersampling (4x)
    scale = 4
    dim = size * scale
    img = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Coordinates scaled
    pad = int(24 * dim / 512)
    radius = int(108 * dim / 512)
    
    # Background rounded rect
    # To make nice gradient:
    bg = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    
    # Gradient on bg
    for y in range(dim):
        t = y / dim
        # #1e1b4b (30, 27, 75) to #0f172a (15, 23, 42)
        r = int(30 * (1 - t) + 15 * t)
        g = int(27 * (1 - t) + 23 * t)
        b = int(75 * (1 - t) + 42 * t)
        bg_draw.line([(0, y), (dim, y)], fill=(r, g, b, 255))
        
    # Mask for rounded rect
    mask = Image.new("L", (dim, dim), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([pad, pad, dim - pad, dim - pad], radius=radius, fill=255)
    
    # Paste gradient with mask
    img.paste(bg, (0, 0), mask)
    
    # Outer border
    border_w = max(1, int(8 * dim / 512))
    draw.rounded_rectangle([pad, pad, dim - pad, dim - pad], radius=radius, outline=(232, 93, 58, 180), width=border_w)

    # Let's draw the Artist Palette
    # Palette center & scale
    # Key anchor points scaled from 512:
    def sc(x, y):
        return (x * dim / 512.0, y * dim / 512.0)

    # Palette shape polygon or bezier approximation
    # Let's draw high quality palette with paint drops & brush
    # Base palette color: ivory/cream (253, 248, 245)
    palette_mask = Image.new("L", (dim, dim), 0)
    p_draw = ImageDraw.Draw(palette_mask)
    
    # Approximating palette with overlapping smooth ellipses / shapes
    p_draw.ellipse([dim*0.14, dim*0.20, dim*0.80, dim*0.74], fill=255)
    p_draw.ellipse([dim*0.22, dim*0.18, dim*0.72, dim*0.62], fill=255)
    p_draw.ellipse([dim*0.38, dim*0.28, dim*0.82, dim*0.76], fill=255)
    p_draw.ellipse([dim*0.12, dim*0.42, dim*0.48, dim*0.78], fill=255)
    
    # Indentation on lower right / thumb grip
    p_draw.ellipse([dim*0.46, dim*0.60, dim*0.76, dim*0.88], fill=0)
    
    # Thumb hole
    p_draw.ellipse([dim*0.22, dim*0.56, dim*0.34, dim*0.70], fill=0)

    # Palette texture
    palette_img = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    pal_draw = ImageDraw.Draw(palette_img)
    for y in range(dim):
        t = y / dim
        r = int(255 * (1 - t) + 243 * t)
        g = int(250 * (1 - t) + 229 * t)
        b = int(245 * (1 - t) + 216 * t)
        pal_draw.line([(0, y), (dim, y)], fill=(r, g, b, 255))
        
    img.paste(palette_img, (0, 0), palette_mask)
    
    # Palette stroke
    pal_border = max(1, int(4 * dim / 512))
    # Thumb hole inner ring
    draw.ellipse([dim*0.22, dim*0.56, dim*0.34, dim*0.70], outline=(201, 194, 184, 255), width=max(1, int(3 * dim / 512)))

    # Paint Spots:
    # 1. Coral / Orange-Red
    def draw_spot(cx, cy, r_spot, col_main, col_hi):
        cx_s = cx * dim / 512.0
        cy_s = cy * dim / 512.0
        r_s = r_spot * dim / 512.0
        draw.ellipse([cx_s - r_s, cy_s - r_s, cx_s + r_s, cy_s + r_s], fill=col_main)
        # Highlight
        hi_r = r_s * 0.35
        draw.ellipse([cx_s - r_s*0.25 - hi_r, cy_s - r_s*0.25 - hi_r, cx_s - r_s*0.25 + hi_r, cy_s - r_s*0.25 + hi_r], fill=col_hi)

    draw_spot(170, 185, 26, (232, 93, 58, 255), (255, 150, 120, 220)) # Primary Coral
    draw_spot(235, 150, 24, (244, 168, 37, 255), (253, 224, 71, 220)) # Warm Amber
    draw_spot(305, 165, 24, (16, 185, 129, 255), (110, 231, 183, 220)) # Emerald Green
    draw_spot(355, 225, 25, (58, 123, 222, 255), (147, 197, 253, 220)) # Royal Blue
    draw_spot(350, 305, 22, (139, 92, 246, 255), (196, 181, 253, 220)) # Violet Purple

    # Paint Brush across diagonally
    # Let's draw the brush:
    # Handle angle: from ~ (440, 100) to (200, 390)
    brush_img = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(brush_img)
    
    # We can rotate a straight vertical brush
    straight = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(straight)
    mid_x = dim / 2
    
    # Handle
    hw = max(2, int(7 * dim / 512))
    s_draw.rectangle([mid_x - hw, dim*0.12, mid_x + hw, dim*0.58], fill=(160, 82, 45, 255))
    s_draw.ellipse([mid_x - hw, dim*0.10, mid_x + hw, dim*0.14], fill=(139, 69, 19, 255))
    
    # Ferrule (silver metal)
    fw = max(3, int(9 * dim / 512))
    s_draw.rounded_rectangle([mid_x - fw, dim*0.58, mid_x + fw, dim*0.68], radius=int(3*dim/512), fill=(180, 190, 200, 255), outline=(100, 116, 139, 255), width=max(1, int(1.5*dim/512)))
    
    # Bristles
    bw = max(2, int(8 * dim / 512))
    s_draw.polygon([
        (mid_x - fw, dim*0.68),
        (mid_x + fw, dim*0.68),
        (mid_x + bw*0.5, dim*0.80),
        (mid_x, dim*0.83),
        (mid_x - bw*0.5, dim*0.80)
    ], fill=(232, 93, 58, 255))
    # Tip highlight
    s_draw.polygon([
        (mid_x - bw*0.3, dim*0.77),
        (mid_x + bw*0.3, dim*0.77),
        (mid_x, dim*0.83)
    ], fill=(255, 140, 100, 240))
    
    # Rotate straight brush by -40 degrees around (dim*0.5, dim*0.5)
    rotated = straight.rotate(-42, resample=Image.BICUBIC, center=(dim*0.5, dim*0.5))
    # Translate slightly to cross nicely
    img.paste(rotated, (int(dim*0.06), int(-dim*0.02)), rotated)

    # Little 4-point golden star sparkle in top right
    def draw_star(sx, sy, size_s, col):
        sx_s = sx * dim / 512.0
        sy_s = sy * dim / 512.0
        r_s = size_s * dim / 512.0
        s_pts = [
            (sx_s, sy_s - r_s),
            (sx_s + r_s*0.25, sy_s - r_s*0.25),
            (sx_s + r_s, sy_s),
            (sx_s + r_s*0.25, sy_s + r_s*0.25),
            (sx_s, sy_s + r_s),
            (sx_s - r_s*0.25, sy_s + r_s*0.25),
            (sx_s - r_s, sy_s),
            (sx_s - r_s*0.25, sy_s - r_s*0.25)
        ]
        draw.polygon(s_pts, fill=col)
        draw.ellipse([sx_s - r_s*0.2, sy_s - r_s*0.2, sx_s + r_s*0.2, sy_s + r_s*0.2], fill=(255, 255, 255, 255))

    draw_star(385, 95, 24, (244, 168, 37, 255))
    draw_star(100, 395, 16, (232, 93, 58, 255))

    # Downsample cleanly to target size with Lanczos filter
    final_img = img.resize((size, size), Image.LANCZOS)
    return final_img

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Generating favicons in {root_dir}...")
    
    # 1. Write SVG
    svg = create_svg()
    svg_path = os.path.join(root_dir, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg)
    print("Created favicon.svg")

    # 2. Generate PNG sizes
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-48x48.png": 48,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512
    }

    images = {}
    for filename, s in sizes.items():
        out_path = os.path.join(root_dir, filename)
        img = draw_icon(s)
        img.save(out_path, format="PNG")
        images[s] = img
        print(f"Created {filename} ({s}x{s})")

    # 3. Create multi-frame favicon.ico (16, 32, 48)
    ico_path = os.path.join(root_dir, "favicon.ico")
    icon_16 = images[16]
    icon_32 = images[32]
    icon_48 = images[48]
    icon_48.save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[icon_16, icon_32]
    )
    print("Created multi-resolution favicon.ico")

    # 4. Create site.webmanifest
    manifest_content = """{
  "name": "ArtCraft Supply Store",
  "short_name": "ArtCraft",
  "description": "Premium Art Materials, Craft Supplies & Creative Workshops",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#E85D3A",
  "background_color": "#1A1A2E",
  "display": "standalone",
  "start_url": "/"
}
"""
    manifest_path = os.path.join(root_dir, "site.webmanifest")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content)
    print("Created site.webmanifest")

if __name__ == "__main__":
    main()
