Add-Type -AssemblyName System.Drawing

function Process-Image {
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

# 1. Japanese Washi Origami Cranes Set
Process-Image -sourcePath 'images/origami_samples/origami_1.jpg' -destPath 'images/product-origami-washi-cranes.jpg' -x 100 -y 150 -w 1800 -h 1350

# 2. Blossom Origami Flower Folding Kit
Process-Image -sourcePath 'images/origami_samples/Origami_flower_-_Carambola.JPG.jpg' -destPath 'images/product-origami-blossom-flowers.jpg' -x 50 -y 50 -w 1850 -h 1388

Write-Host "Done processing origami product images!"
