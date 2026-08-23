Add-Type -AssemblyName System.Drawing

function Crop-Image ($sourcePath, $destPath, $targetWidth, $targetHeight) {
    $src = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath).Path)
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

    $outPath = [System.IO.Path]::Combine((Get-Location).Path, $destPath)
    if (Test-Path $outPath) {
        Remove-Item -Force $outPath
    }
    $bmp.Save($outPath, $codec, $encoderParams)

    $graphics.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Output "Successfully saved $outPath"
}

Crop-Image "scratch/studio_brushes.jpg" "images/blog-art-tips-color-palette-mastery.jpg" 1200 800
