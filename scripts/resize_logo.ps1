Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\Extension New Logo.jpeg"
$bmp = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image {
    param(
        [System.Drawing.Image]$image,
        [string]$destPath,
        [int]$width,
        [int]$height,
        [bool]$makeGray = $false
    )
    $destBmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($image, 0, 0, $width, $height)
    $g.Dispose()

    if ($makeGray) {
        for ($x = 0; $x -lt $width; $x++) {
            for ($y = 0; $y -lt $height; $y++) {
                $c = $destBmp.GetPixel($x, $y)
                $gray = [int]($c.R * 0.3 + $c.G * 0.59 + $c.B * 0.11)
                $grayColor = [System.Drawing.Color]::FromArgb($c.A, $gray, $gray, $gray)
                $destBmp.SetPixel($x, $y, $grayColor)
            }
        }
    }

    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Host "Saved: $destPath ($width x $height)"
}

# Resize to official target paths
Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo.png" 128 128
Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo-beta.png" 128 128
Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo-gray.png" 128 128 -makeGray $true

Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo-32.png" 32 32
Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo-beta-32.png" 32 32
Resize-Image $bmp "c:\Users\Hp\Downloads\scriptcat-main\scriptcat-main\src\assets\logo-gray-32.png" 32 32 -makeGray $true

$bmp.Dispose()
