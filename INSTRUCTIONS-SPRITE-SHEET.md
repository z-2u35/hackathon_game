# Hướng dẫn xử lý Player Sprite Sheet

## 📋 Bước 1: Cắt Sprite Sheet thành 16 frames

Bạn có sprite sheet 4×4 (16 frames). Có 3 cách để cắt:

### Cách 1: Sử dụng Python (Khuyến nghị)

```bash
# Cài đặt Pillow nếu chưa có
pip install Pillow

# Cắt sprite sheet
python split-sprite-python.py player-sheet.png 32 32 4 4
```

Kết quả: Tạo thư mục `player-sheet_frames/` với 16 frames (`frame_00.png` đến `frame_15.png`)

### Cách 2: Sử dụng Node.js với Sharp

```bash
# Cài đặt sharp
npm install sharp

# Cắt sprite sheet
node split-sprite-sheet.js player-sheet.png 32 32 4 4
```

### Cách 3: Sử dụng ImageMagick

```bash
magick player-sheet.png -crop 32x32 +repage +adjoin frame_%02d.png
```

## 📋 Bước 2: Tổ chức lại frames theo format GBA

Sau khi cắt, chạy script để tổ chức lại:

```bash
node organize-player-sprites.js ./player-sheet_frames ./client/public/assets
```

Script sẽ:
1. Copy các frames vào `client/public/assets/characters/player/`
2. Đặt tên theo format: `spr_seeker_idle_down_0.png`, `spr_seeker_walk_right_1.png`, etc.
3. Tạo sprite sheet mới theo format GBA: `spr_seeker_sheet.png` (1024×32)
4. Tạo metadata file: `spr_seeker_sheet.sheet.json`

## 📋 Bước 3: Mapping từ Sprite Sheet gốc

Dựa trên mô tả sprite sheet của bạn:

### Row 1 (Frames 0-3): Idle Right/Front-Right
- → Sử dụng cho: `idle_right` (4 frames)

### Row 2 (Frames 4-7): Back Views
- → Sử dụng cho: `idle_up` (4 frames)

### Row 3 (Frames 8-11): Walk Right
- → Sử dụng cho: `walk_right` (frames 0-3)

### Row 4 (Frames 12-15): Walk Right (tiếp)
- → Sử dụng cho: `walk_right` (frames 4-7, lấy 4 đầu)

### Các hướng khác (Down, Left):
- **Idle Down**: Tạm dùng back view (frames 4-7)
- **Idle Left**: Tạm dùng right view (frames 0-3) - có thể flip sau
- **Walk Down**: Tạm dùng back view (frames 4-7)
- **Walk Left**: Tạm dùng right view (frames 8-11) - có thể flip sau

## 📋 Bước 4: Kiểm tra kết quả

Sau khi chạy script, kiểm tra:

```bash
# Xem các frames đã được tổ chức
dir client\public\assets\characters\player\*.png

# Kiểm tra sprite sheet mới
dir client\public\assets\characters\player\spr_seeker_sheet.png
```

## 📋 Bước 5: Test trong game

Code đã được cập nhật để tự động load sprite sheet. Chỉ cần:

1. Đảm bảo file `spr_seeker_sheet.png` và `spr_seeker_sheet.sheet.json` tồn tại
2. Chạy game và test di chuyển WASD
3. Player sprite sẽ tự động chuyển animation theo direction và state (idle/walk)

## 🔧 Nếu cần chỉnh sửa mapping

Sửa file `organize-player-sprites.js` trong phần `gbaMapping` để thay đổi cách map frames.

## 💡 Tips

- **Flip sprites**: Nếu cần flip left từ right, có thể dùng `sprite.scale.x = -1` trong PixiJS
- **Animation speed**: Điều chỉnh trong `createAnimatedSprite(frames, 0.15)` - 0.15 là GBA standard
- **Sprite size**: Đảm bảo mỗi frame là 32×32 pixels (GBA standard)

