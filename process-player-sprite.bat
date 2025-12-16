@echo off
REM Batch script để xử lý player sprite sheet
REM Yêu cầu: ImageMagick hoặc Python với PIL

echo 🎮 Processing Player Sprite Sheet...
echo.

REM Kiểm tra ImageMagick
where magick >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ ImageMagick found
    goto :use_magick
)

REM Kiểm tra Python
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python found
    goto :use_python
)

echo ❌ Cần cài ImageMagick hoặc Python với PIL
echo 💡 Hoặc sử dụng script Node.js với sharp: npm install sharp
pause
exit /b 1

:use_magick
echo 📦 Using ImageMagick...
echo.
echo 📖 Usage:
echo    magick player-sheet.png -crop 32x32 +repage +adjoin frame_%%02d.png
echo.
echo 💡 Hoặc chạy: node split-sprite-sheet.js player-sheet.png 32 32 4 4
pause
exit /b 0

:use_python
echo 📦 Using Python...
echo.
echo 📖 Tạo file Python script để cắt ảnh...
pause
exit /b 0

