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

# 1. Japanese Cranes from origami_1.jpg (3008x1880)
# Crop center focus on the two cranes
Process-Image -sourcePath 'images/origami_samples/origami_1.jpg' -destPath 'images/origami-japanese-cranes.jpg' -x 200 -y 200 -w 2500 -h 1600

# 2. Modular Kusudama Flower Sphere from kusudama_1.jpg (2592x1944)
# Crop centered around the geometric origami sphere
Process-Image -sourcePath 'images/origami_samples/kusudama_1.jpg' -destPath 'images/origami-modular-kusudama.jpg' -x 150 -y 50 -w 2300 -h 1725

Write-Host "Processed both origami workshop images!"
