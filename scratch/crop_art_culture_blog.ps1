Add-Type -AssemblyName System.Drawing

# 1. Japanese Washi Paper Making
$washiSrc = (Resolve-Path 'images/art_culture_samples/Japanese_paper_making_02.jpg.jpg').Path
$bytes1 = [System.IO.File]::ReadAllBytes($washiSrc)
$ms1 = New-Object System.IO.MemoryStream(,$bytes1)
$src1 = [System.Drawing.Image]::FromStream($ms1)

Write-Host "Washi original: $($src1.Width) x $($src1.Height)"

$targetW = 1200
$targetH = 800

$dest1 = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g1 = [System.Drawing.Graphics]::FromImage($dest1)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Focus on papermaker hands and bamboo screen
$srcRect1 = New-Object System.Drawing.Rectangle(200, 100, 2400, 1600)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$g1.DrawImage($src1, $destRect, $srcRect1, [System.Drawing.GraphicsUnit]::Pixel)

$destFile1 = Join-Path (Get-Location) 'images/blog-japanese-washi-craft.jpg'
$dest1.Save($destFile1, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g1.Dispose()
$dest1.Dispose()
$src1.Dispose()
$ms1.Dispose()

Write-Host "Saved images/blog-japanese-washi-craft.jpg"

# 2. Urban Sketcher Drawing On Location
$urbanSrc = (Resolve-Path 'images/blog_samples/Berberic_painter_drawing_a_bookmark.jpg').Path
$bytes2 = [System.IO.File]::ReadAllBytes($urbanSrc)
$ms2 = New-Object System.IO.MemoryStream(,$bytes2)
$src2 = [System.Drawing.Image]::FromStream($ms2)

Write-Host "Urban original: $($src2.Width) x $($src2.Height)"

$dest2 = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g2 = [System.Drawing.Graphics]::FromImage($dest2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Focus on artist sketching in sketchbook with ink palette and drawing tools
# Original is 3000 x 4000 portrait
$srcRect2 = New-Object System.Drawing.Rectangle(0, 900, 3000, 2000)
$g2.DrawImage($src2, $destRect, $srcRect2, [System.Drawing.GraphicsUnit]::Pixel)

$destFile2 = Join-Path (Get-Location) 'images/blog-urban-sketchers.jpg'
$dest2.Save($destFile2, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g2.Dispose()
$dest2.Dispose()
$src2.Dispose()
$ms2.Dispose()

Write-Host "Saved images/blog-urban-sketchers.jpg"
