Add-Type -AssemblyName System.Drawing

function Crop-Fill($srcFile, $destFile, $targetW = 1200, $targetH = 800) {
    $bytes = [System.IO.File]::ReadAllBytes($srcFile)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $src = [System.Drawing.Image]::FromStream($ms)
    
    $srcW = $src.Width
    $srcH = $src.Height
    
    $targetAspect = $targetW / $targetH
    $srcAspect = $srcW / $srcH
    
    if ($srcAspect -gt $targetAspect) {
        # Source is wider than target: fit height, crop width
        $cropH = $srcH
        $cropW = [int]($srcH * $targetAspect)
        $cropX = [int](($srcW - $cropW) / 2)
        $cropY = 0
    } else {
        # Source is taller than target: fit width, crop height
        $cropW = $srcW
        $cropH = [int]($srcW / $targetAspect)
        $cropX = 0
        $cropY = [int](($srcH - $cropH) / 2)
    }
    
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
    Write-Host "Created $destFile ($cropW x $cropH cropped from $srcW x $srcH)"
}

# 1. Workshop 3: Hand Building Clay on Potter's Wheel
$f1 = (Resolve-Path 'images/workshop_samples/pottery_Potter_shaping_clay_on_a_tradi.jpg').Path
$d1 = Join-Path (Get-Location) 'images/ws-handbuilding-clay.jpg'
Crop-Fill $f1 $d1

# 2. Workshop 4: Dedicated Origami Art Workshop
$f2 = (Resolve-Path 'images/origami_samples/origami_3.jpg').Path
$d2 = Join-Path (Get-Location) 'images/ws-origami-art-class.jpg'
Crop-Fill $f2 $d2

# 3. Blog 13: What to Expect at Your First In-Studio Art Workshop
$f3 = (Resolve-Path 'images/workshop-hero-upcoming-studio.jpg').Path
$d3 = Join-Path (Get-Location) 'images/blog-studio-art-workshop.jpg'
Crop-Fill $f3 $d3

# 4. Blog 14: Community Pottery & Sculpting
$f4 = (Resolve-Path 'images/workshop_samples/pottery_02025_0230_Early_medieval_pott.jpg').Path
$d4 = Join-Path (Get-Location) 'images/blog-pottery-group-workshop.jpg'
Crop-Fill $f4 $d4

# 5. Blog 20: Interactive Craft Workshops
$f5 = (Resolve-Path 'images/workshop_samples/ws_crafting_hands_table.jpg').Path
$d5 = Join-Path (Get-Location) 'images/blog-craft-workshop-hands.jpg'
Crop-Fill $f5 $d5
