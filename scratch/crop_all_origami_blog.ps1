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
    
    if (Test-Path $destFile) { Remove-Item -Path $destFile -Force }
    $dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
    $ms.Dispose()
    Write-Host "Created $destFile"
}

# 1. Blog 11: Precision Folds & Geometric Origami Flowers (3081 x 2448)
$f1 = (Resolve-Path 'images/origami_samples/Origami_flower_-_Carambola.JPG.jpg').Path
$d1 = Join-Path (Get-Location) 'images/blog-origami-precision-folds.jpg'
Crop-Image $f1 $d1 0 200 3081 2054

# 2. Blog 12: Choosing Origami Paper - Traditional Washi & Chiyogami Cranes (2000 x 1333)
$f2 = (Resolve-Path 'images/origami_samples/Barack_Obama_folded_paper_crane._Na.jpg').Path
$d2 = Join-Path (Get-Location) 'images/blog-origami-paper-selection.jpg'
Crop-Image $f2 $d2 0 0 2000 1333

# 3. Dedicated White Origami Crane (2080 x 1672)
$f3 = (Resolve-Path 'images/origami_samples/kusudama_5.jpg').Path
$d3 = Join-Path (Get-Location) 'images/blog-origami-crane-sculpture.jpg'
Crop-Image $f3 $d3 0 144 2080 1386
