Add-Type -AssemblyName System.Drawing

function Process-Image {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$x,
        [int]$y,
        [int]$w,
        [int]$h
    )
    $srcPath = (Resolve-Path $sourcePath).Path
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $src = [System.Drawing.Image]::FromStream($ms)
    
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
    
    $fullDest = Join-Path (Get-Location) $destPath
    $dest.Save($fullDest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
    $ms.Dispose()
    Write-Host "Created $destPath ($w x $h)"
}

# 1. Macrame Knots on Wood
Process-Image -sourcePath 'images/crafting_samples/FileMacrame_Basic_Knotsjpg.jpg' -destPath 'images/ws-macrame-wall-hanging.jpg' -x 0 -y 50 -w 4000 -h 3000

# 2. Hand Embroidery Floral Hoop
Process-Image -sourcePath 'images/crafting_samples/FileEmbroidery_by_Hand_Sample_with_Desig.jpg' -destPath 'images/ws-hand-embroidery-floral.jpg' -x 50 -y 150 -w 2900 -h 2175

Write-Host "Done processing craft images!"
