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
    $srcPath = (Resolve-Path $sourcePath).Path
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $src = [System.Drawing.Image]::FromStream($ms)
    
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
    
    $fullDest = Join-Path (Get-Location) $destPath
    $dest.Save($fullDest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
    $ms.Dispose()
    Write-Host "Created $destPath ($w x $h)"
}

# 1. Workshop 1: Watercolor Basics (from product-bg.jpg)
Crop-Image -sourcePath 'images/backgrounds/product-bg.jpg' -destPath 'images/ws-watercolor-basics.jpg' -x 0 -y 0 -w 1370 -h 768

# 2. Workshop 2: Modern Calligraphy (from brands-bg.jpg)
Crop-Image -sourcePath 'images/backgrounds/brands-bg.jpg' -destPath 'images/ws-modern-calligraphy.jpg' -x 0 -y 0 -w 1350 -h 768

# 6. Workshop 6: Urban Sketching (from about-bg.jpg)
Crop-Image -sourcePath 'images/backgrounds/about-bg.jpg' -destPath 'images/ws-urban-sketching.jpg' -x 280 -y 120 -w 1090 -h 618

# 9. Workshop 9: Botanical Watercolor (from blog-bg.jpg)
Crop-Image -sourcePath 'images/backgrounds/blog-bg.jpg' -destPath 'images/ws-botanical-watercolor.jpg' -x 520 -y 0 -w 850 -h 768

# Copy Full Studio Workshops for Hero Banners
Copy-Item 'images/backgrounds/about-bg.jpg' 'images/ws-hero-all-studio.jpg' -Force
Copy-Item 'images/backgrounds/workshops-bg.jpg' 'images/ws-hero-upcoming-studio.jpg' -Force
Write-Host "Done generating new images!"
