Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path 'images/origami_samples/origami_1.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

$w = 2440
$h = 1830
$x = 550
$y = 0

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$dest = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)

$destFile = Join-Path (Get-Location) 'images/product-origami-japanese-cranes.jpg'
$dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Created images/product-origami-japanese-cranes.jpg ($w x $h)"
