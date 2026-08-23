import subprocess

ps_script = """
Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path 'images/origami_samples/origami_1.jpg').Path
$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Image]::FromStream($ms)

$w = 2400
$h = 1800
$x = 300
$y = 15

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$dest = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)

$destPath = 'images/product-origami-washi-cranes.jpg'
if (Test-Path $destPath) { Remove-Item $destPath -Force }

$dest.Save((Resolve-Path .).Path + '/' + $destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$dest.Dispose()
$src.Dispose()
$ms.Dispose()

Write-Host "Successfully cropped images/product-origami-washi-cranes.jpg ($w x $h)"
"""

with open('scratch/do_crop.ps1', 'w', encoding='utf-8') as f:
    f.write(ps_script)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "scratch/do_crop.ps1"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
