# 🔧 Fix Sprite Sheet Error

## Lỗi hiện tại

```
Texture Error: frame does not fit inside the base Texture dimensions: X: 0 + 32 = 32 > 1
```

Lỗi này xảy ra khi:
1. Sprite sheet chưa được tạo (vẫn là placeholder 1×1)
2. File sprite sheet không tồn tại
3. Kích thước sprite sheet không đúng

## Giải pháp

### Cách 1: Tạo sprite sheet từ player frames (Nếu đã có frames riêng lẻ)

Nếu bạn đã có các frames riêng lẻ trong `client/public/assets/characters/player/`:

```bash
# Sử dụng script organize-player-sprites.js đã tạo
# Script này sẽ tự động tạo sprite sheet từ các frames
```

### Cách 2: Tạo sprite sheet thủ công

1. **Sử dụng Aseprite/Photoshop**:
   - Tạo canvas mới: 1024×32 pixels
   - Đặt 32 frames, mỗi frame 32×32
   - Export PNG với "nearest neighbor" scaling
   - Lưu vào: `client/public/assets/characters/player/spr_seeker_sheet.png`

2. **Sử dụng ImageMagick**:
   ```bash
   # Ghép các frames thành sprite sheet
   magick montage frame_*.png -tile 32x1 -geometry 32x32+0+0 spr_seeker_sheet.png
   ```

### Cách 3: Tạm thời sử dụng Fallback Graphics

Code đã được cập nhật để tự động fallback về Graphics nếu sprite sheet không tồn tại. Game vẫn chạy được với player sprite vẽ bằng Graphics.

## Kiểm tra

1. **Kiểm tra file có tồn tại không**:
   ```bash
   Test-Path "client\public\assets\characters\player\spr_seeker_sheet.png"
   ```

2. **Kiểm tra kích thước file**:
   - File phải có kích thước ít nhất 32×32 (không phải 1×1 placeholder)
   - Sprite sheet đầy đủ: 1024×32 (32 frames × 32px)

3. **Kiểm tra metadata**:
   - File `spr_seeker_sheet.sheet.json` phải tồn tại
   - Metadata phải đúng với kích thước thực tế

## Code đã được sửa

✅ **assetLoader.ts**:
- Thêm kiểm tra kích thước texture
- Thêm error handling tốt hơn
- Throw error rõ ràng khi texture quá nhỏ

✅ **IsometricLevel.tsx**:
- Fallback Graphics được cải thiện
- Vẽ player sprite đẹp hơn khi không có sprite sheet
- Log warnings để debug

## Next Steps

1. **Nếu chưa có sprite sheet**: Game vẫn chạy với fallback Graphics
2. **Khi có sprite sheet**: Chỉ cần đặt file vào đúng vị trí, game sẽ tự động load
3. **Test**: Chạy game và kiểm tra console - không còn error nữa

## Lưu ý

- Fallback Graphics sẽ được sử dụng cho đến khi sprite sheet thật được tạo
- Game vẫn hoạt động bình thường với fallback
- Khi có sprite sheet, chỉ cần refresh page là sẽ tự động load

