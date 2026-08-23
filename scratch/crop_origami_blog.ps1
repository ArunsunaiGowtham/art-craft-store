Add-Type -AssemblyName System.Drawing

# Crop kusudama_1.jpg for Blog 11: "The Art of Origami: Precision Folds and Modular Designs"
$srcPath = (Resolve-Path 'images/origami_samples/kusudama_1.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

Write-Host "Origami source dimensions: $($src.Width) x $($src.Height)"

$targetW = 1200
$targetH = 800

$dest = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Center crop on the modular kusudama folded geometry
$srcRect = New-Object System.Drawing.Rectangle(200, 100, 3600, 2400)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$destFile = Join-Path (Get-Location) 'images/blog-origami-precision-folds.jpg'
$dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Successfully created images/blog-origami-precision-folds.jpg"
