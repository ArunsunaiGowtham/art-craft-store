Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path 'images/origami_samples/origami_1.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

Write-Host "Original dimensions: $($src.Width) x $($src.Height)"

# Let's crop with both cranes perfectly centered in a 4:3 frame:
# Both cranes span from x ~ 300 to 2200, y ~ 400 to 1800
# Let's use x = 250, y = 350, w = 2100, h = 1575
$w = 2100
$h = 1575
$x = 250
$y = 350

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$dest = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)

$dest.Save((Join-Path (Get-Location) 'images/product-origami-washi-cranes.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Saved images/product-origami-washi-cranes.jpg ($w x $h)"
