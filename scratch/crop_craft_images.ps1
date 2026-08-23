
Add-Type -AssemblyName System.Drawing

function Crop-Image ($sourcePath, $destPath, $targetWidth, $targetHeight) {
    $src = [System.Drawing.Image]::FromFile($sourcePath)
    
    $srcWidth = $src.Width
    $srcHeight = $src.Height
    
    $targetAspect = $targetWidth / $targetHeight
    $srcAspect = $srcWidth / $srcHeight
    
    if ($srcAspect -gt $targetAspect) {
        $cropHeight = $srcHeight
        $cropWidth = [int]($srcHeight * $targetAspect)
        $cropX = [int](($srcWidth - $cropWidth) / 2)
        $cropY = 0
    } else {
        $cropWidth = $srcWidth
        $cropHeight = [int]($srcWidth / $targetAspect)
        $cropX = 0
        $cropY = [int](($srcHeight - $cropHeight) / 2)
    }
    
    $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropWidth, $cropHeight)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
    
    $graphics.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    
    $bmp.Save($destPath, $codec, $encoderParams)
    
    $graphics.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Output "Successfully saved $destPath"
}

Crop-Image "images/crafting_samples/Resin_art.jpg.jpg" "images/blog-resin-art-casting.jpg" 1200 800
Crop-Image "images/crafting_samples/FileFamous_Lumban_Laguna_embroidery_hoop.jpg" "images/blog-embroidery-hoop-tutorial.jpg" 1200 800
