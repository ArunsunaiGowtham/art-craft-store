Add-Type -AssemblyName System.Drawing

$urbanSrc = (Resolve-Path 'images/blog_samples/Berberic_painter_drawing_a_bookmark.jpg').Path
$bytes2 = [System.IO.File]::ReadAllBytes($urbanSrc)
$ms2 = New-Object System.IO.MemoryStream(,$bytes2)
$src2 = [System.Drawing.Image]::FromStream($ms2)

$targetW = 1200
$targetH = 800

$dest2 = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g2 = [System.Drawing.Graphics]::FromImage($dest2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Focus on the artist, hands drawing in the sketchbook, and the painting table with ink pots
$srcRect2 = New-Object System.Drawing.Rectangle(0, 1800, 3888, 2592)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$g2.DrawImage($src2, $destRect, $srcRect2, [System.Drawing.GraphicsUnit]::Pixel)

$destFile2 = Join-Path (Get-Location) 'images/blog-urban-sketchers.jpg'
if (Test-Path $destFile2) { Remove-Item $destFile2 -Force }

$dest2.Save($destFile2, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g2.Dispose()
$dest2.Dispose()
$src2.Dispose()
$ms2.Dispose()

Write-Host "Successfully re-cropped images/blog-urban-sketchers.jpg"
