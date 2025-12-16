# 🚀 Quick Start: Xử lý Player Sprite Sheet

## Bước 1: Đặt ảnh sprite sheet vào thư mục gốc

Đặt file sprite sheet của bạn (4×4 grid, 16 frames) vào thư mục gốc dự án:
```
hackathon_game-khoa_dev/player-sheet.png
```

## Bước 2: Cắt sprite sheet (Chọn 1 trong 3 cách)

### ✅ Cách 1: Python (Khuyến nghị - dễ nhất)

```bash
# Cài Pillow nếu chưa có
pip install Pillow

# Cắt sprite sheet
python split-sprite-python.py player-sheet.png 32 32 4 4
```

Kết quả: Tạo thư mục `player-sheet_frames/` với 16 frames

### Cách 2: Node.js với Sharp

```bash
# Sharp đã được cài đặt
node split-sprite-sheet.js player-sheet.png 32 32 4 4
```

### Cách 3: ImageMagick

```bash
magick player-sheet.png -crop 32x32 +repage +adjoin frame_%02d.png
```

## Bước 3: Tổ chức lại theo format GBA

```bash
node organize-player-sprites.js ./player-sheet_frames ./client/public/assets
```

Script sẽ:
- ✅ Copy frames vào `client/public/assets/characters/player/`
- ✅ Đặt tên theo format GBA: `spr_seeker_idle_down_0.png`, etc.
- ✅ Tạo sprite sheet mới: `spr_seeker_sheet.png` (1024×32)
- ✅ Tạo metadata: `spr_seeker_sheet.sheet.json`

## Bước 4: Test trong game

1. Chạy dev server: `npm run dev`
2. Vào `/play` và bấm "VÀO GAME STORY MODE"
3. Dùng WASD để di chuyển - player sprite sẽ tự động load và animate!

## 📋 Mapping Frames

Dựa trên sprite sheet của bạn:

| Sprite Sheet | → | GBA Format |
|-------------|---|------------|
| Row 1 (0-3) | → | `idle_right` (4 frames) |
| Row 2 (4-7) | → | `idle_up` (4 frames) |
| Row 3 (8-11) | → | `walk_right` (4 frames) |
| Row 4 (12-15) | → | Không dùng (hoặc dùng cho walk_right frames 4-7) |

**Các hướng khác (Down, Left)**: Tạm dùng back/right views, có thể flip sau.

## 🔧 Nếu cần chỉnh mapping

Sửa file `organize-player-sprites.js` trong phần `gbaMapping`.

## ✅ Kết quả mong đợi

Sau khi chạy script, bạn sẽ có:
- `client/public/assets/characters/player/spr_seeker_sheet.png` (1024×32)
- `client/public/assets/characters/player/spr_seeker_sheet.sheet.json`
- Các frames riêng lẻ: `spr_seeker_idle_down_0.png`, etc.

Code đã được cập nhật để tự động load và sử dụng sprite sheet này!

