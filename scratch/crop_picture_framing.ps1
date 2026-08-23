Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path 'images/blog_samples/Picture_Frame_Profile_Chevrons_In_W.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

Write-Host "Original dimensions: $($src.Width) x $($src.Height)"

# Crop the wooden frame corner and profile
$targetW = 1200
$targetH = 800

$dest = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle(200, 100, 2600, 1733)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$destFile = Join-Path (Get-Location) 'images/blog-custom-picture-framing.jpg'
$dest.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Saved images/blog-custom-picture-framing.jpg ($targetW x $targetH)"
