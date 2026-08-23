Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path 'images/crafting_samples/Leathertools.jpg.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

Write-Host "Original dimensions: $($src.Width) x $($src.Height)"

# Crop the leather tools, punch, swatches, and leather craft samples
# Dimensions ~ 2000 x 2000 or 4:3 ratio
$w = 1800
$h = 1800
$x = 100
$y = 600

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

$destFile = Join-Path (Get-Location) 'images/product-diy-leathercraft-kit.jpg'
$dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Saved images/product-diy-leathercraft-kit.jpg ($w x $h)"
