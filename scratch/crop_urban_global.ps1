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

# Focus on the artist sketching in sketchbook with ink palette and drawing tools
$srcRect2 = New-Object System.Drawing.Rectangle(0, 1800, 3888, 2592)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$g2.DrawImage($src2, $destRect, $srcRect2, [System.Drawing.GraphicsUnit]::Pixel)

$destFile = Join-Path (Get-Location) 'images/blog-urban-sketching-global.jpg'
$dest2.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g2.Dispose()
$dest2.Dispose()
$src2.Dispose()
$ms2.Dispose()

Write-Host "Successfully saved images/blog-urban-sketching-global.jpg"
