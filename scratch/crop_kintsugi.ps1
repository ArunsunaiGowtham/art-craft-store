Add-Type -AssemblyName System.Drawing
$srcPath = "c:\Users\aruns\OneDrive\Documents\Default Project\art-craft-store\images\blog-art-culture-kintsugi-bowl.jpg"
$outPath = "c:\Users\aruns\OneDrive\Documents\Default Project\art-craft-store\images\blog-art-culture-kintsugi-final.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
$targetWidth = 800
$targetHeight = 533
$dest = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$aspectRatio = $targetWidth / $targetHeight
$srcAspect = $src.Width / $src.Height

if ($srcAspect -gt $aspectRatio) {
    $cropH = $src.Height
    $cropW = [int]($src.Height * $aspectRatio)
    $cropX = [int](($src.Width - $cropW) / 2)
    $cropY = 0
} else {
    $cropW = $src.Width
    $cropH = [int]($src.Width / $aspectRatio)
    $cropX = 0
    $cropY = [int](($src.Height - $cropH) / 2)
}

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$src.Dispose()
$dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$dest.Dispose()
$g.Dispose()

Remove-Item $srcPath
Move-Item -Force $outPath "c:\Users\aruns\OneDrive\Documents\Default Project\art-craft-store\images\blog-art-culture-kintsugi-philosophy.jpg"
Write-Output "Kintsugi image cropped successfully"
