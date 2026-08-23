Add-Type -AssemblyName System.Drawing

function Crop-Image {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$x,
        [int]$y,
        [int]$w,
        [int]$h
    )
    $src = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath))
    
    # Ensure crop fits within bounds
    if ($x + $w -gt $src.Width) { $w = $src.Width - $x }
    if ($y + $h -gt $src.Height) { $h = $src.Height - $y }
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dest = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $src.Dispose()
    
    $fullDest = Join-Path (Get-Location) $destPath
    if (Test-Path $fullDest) { Remove-Item $fullDest -Force }
    $dest.Save($fullDest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dest.Dispose()
    Write-Host "Created $destPath ($w x $h)"
}

# 1. Workshop 1: Watercolor Basics (from product-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/product-bg.jpg' -destPath 'images/workshop-watercolor-basics.jpg' -x 0 -y 0 -w 1440 -h 1080

# 2. Workshop 2: Modern Calligraphy (from brands-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/brands-bg.jpg' -destPath 'images/workshop-modern-calligraphy.jpg' -x 0 -y 0 -w 1350 -h 1012

# 6. Workshop 6: Urban Sketching (from about-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/about-bg.jpg' -destPath 'images/workshop-urban-sketching.jpg' -x 280 -y 150 -w 1240 -h 930

# 9. Workshop 9: Botanical Watercolor (from blog-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/blog-bg.jpg' -destPath 'images/workshop-botanical-watercolor.jpg' -x 520 -y 0 -w 1400 -h 1050

# Copy Full Studio Workshops for Hero Banners
Copy-Item 'images/backgrounds/about-bg.jpg' 'images/workshop-hero-all-studio.jpg' -Force
Copy-Item 'images/backgrounds/workshops-bg.jpg' 'images/workshop-hero-upcoming-studio.jpg' -Force
Write-Host "All crops regenerated with zero black borders!"
