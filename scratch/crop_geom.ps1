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

# 1. Blog 11: Geometric Folded Origami Star Flowers (3081 x 2448)
$f1 = (Resolve-Path 'images/origami_samples/Origami_flower_-_Carambola.JPG.jpg').Path
$d1 = Join-Path (Get-Location) 'images/blog-origami-geometric-folds.jpg'
Crop-Image $f1 $d1 0 200 3081 2054
