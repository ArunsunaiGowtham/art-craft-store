Add-Type -AssemblyName System.Drawing

function Crop-Image($srcFile, $destFile, $cropX, $cropY, $cropW, $cropH) {
    $bytes = [System.IO.File]::ReadAllBytes($srcFile)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $src = [System.Drawing.Image]::FromStream($ms)
    
    $targetW = 1200
    $targetH = 800
    $dest = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
    $ms.Dispose()
    Write-Host "Created $destFile"
}

# 1. Workshop 3: Hand Building / Pottery Wheel Clay Sculpting
$f1 = (Resolve-Path 'images/workshop_samples/pottery_Potter_shaping_clay_on_a_tradi.jpg').Path
$d1 = Join-Path (Get-Location) 'images/ws-hand-building-clay-wheel.jpg'
Crop-Image $f1 $d1 0 500 5500 3666

# 2. Workshop 4: Dedicated Origami Art Workshop (Basic to Advanced)
$f2 = (Resolve-Path 'images/origami_samples/origami_3.jpg').Path
$d2 = Join-Path (Get-Location) 'images/ws-origami-art-class.jpg'
Crop-Image $f2 $d2 0 0 5456 3632

# 3. Blog 13: What to Expect at Your First In-Studio Art Workshop
$f3 = (Resolve-Path 'images/workshop-hero-upcoming-studio.jpg').Path
$d3 = Join-Path (Get-Location) 'images/blog-studio-art-workshop.jpg'
Crop-Image $f3 $d3 0 100 1920 1080

# 4. Blog 14: Community Pottery & Sculpting: The Joy of Group Clay Classes
$f4 = (Resolve-Path 'images/workshop_samples/pottery_Potter_shaping_clay_on_a_tradi.jpg').Path
$d4 = Join-Path (Get-Location) 'images/blog-pottery-group-workshop.jpg'
Crop-Image $f4 $d4 200 400 5000 3333

# 5. Blog 20: Interactive Craft Workshops: From Macramé to Artisan Woodcraft
$f5 = (Resolve-Path 'images/workshop_samples/ws_crafting_hands_table.jpg').Path
$d5 = Join-Path (Get-Location) 'images/blog-craft-workshop-hands.jpg'
Crop-Image $f5 $d5 0 0 1200 800
