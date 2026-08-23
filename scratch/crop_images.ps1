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
    $dest.Save($fullDest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dest.Dispose()
    Write-Host "Created $destPath successfully"
}

# 1. Workshop 1: Watercolor Basics (from product-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/product-bg.jpg' -destPath 'images/workshop-watercolor-basics.jpg' -x 0 -y 100 -w 1500 -h 980

# 2. Workshop 2: Modern Calligraphy (from brands-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/brands-bg.jpg' -destPath 'images/workshop-modern-calligraphy.jpg' -x 0 -y 300 -w 1050 -h 780

# 6. Workshop 6: Urban Sketching (from about-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/about-bg.jpg' -destPath 'images/workshop-urban-sketching.jpg' -x 300 -y 350 -w 1200 -h 730

# 9. Workshop 9: Botanical Watercolor (from blog-bg.jpg 1920x1080)
Crop-Image -sourcePath 'images/backgrounds/blog-bg.jpg' -destPath 'images/workshop-botanical-watercolor.jpg' -x 700 -y 0 -w 1150 -h 1050

# Copy Full Studio Workshops for Hero Banners
Copy-Item 'images/backgrounds/about-bg.jpg' 'images/workshop-hero-all-studio.jpg' -Force
Copy-Item 'images/backgrounds/workshops-bg.jpg' 'images/workshop-hero-upcoming-studio.jpg' -Force
Write-Host "All workshop and hero images generated and ready!"
