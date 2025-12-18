# Hướng dẫn xử lý Sprite Sheets cho Mirror Hallway

## Tổng quan
Script sẽ xử lý 4 loại sprite sheets:
1. **Hình 1**: Sương mù/Camouflage pattern → `fx/fx_fog_pattern.png`
2. **Hình 2**: Floor tiles (mossy, bloody) + Wall tiles → `tilesets/floor/` và `tilesets/wall/`
3. **Hình 3**: FX effects (glitch_static, light_glow_amber, fog_war) → `fx/`
4. **Hình 4**: Seamless tiles + Props → `tilesets/floor/`, `tilesets/wall/`, `tilesets/props/`

## Cách sử dụng

### Bước 1: Đặt các file sprite sheets vào thư mục
Đặt các file PNG sprite sheets vào một thư mục (ví dụ: `C:/HK251/Hackathon/sprites`)

### Bước 2: Chạy script
```bash
cd hackathon_game-khoa_dev
python process-all-assets.py "C:/HK251/Hackathon/sprites"
```

### Bước 3: Kiểm tra kết quả
Các frames đã cắt sẽ được lưu vào:
- `client/public/assets/fx/` - FX effects
- `client/public/assets/tilesets/floor/` - Floor tiles
- `client/public/assets/tilesets/wall/` - Wall tiles
- `client/public/assets/tilesets/props/` - Props

## Cấu trúc Sprite Sheets

### Hình 3: FX Effects
- **fx_glitch_static**: 10 frames (2 rows × 5 cols), mỗi frame 64×64px
- **fx_light_glow_amber**: 9 frames (1 row × 9 cols), mỗi frame 64×64px
- **fx_fog_war**: 5 frames (1 row × 5 cols), mỗi frame 64×64px

### Hình 2 & 4: Tilesets
- **Floor tiles clean**: 9 tiles (3×3 grid), mỗi tile 48×48px
- **Floor tiles cracked**: 9 tiles (3×3 grid), mỗi tile 48×48px
- **Floor mossy**: 4 tiles (2×2 grid), mỗi tile 48×48px
- **Floor bloody**: 4 tiles (2×2 grid), mỗi tile 48×48px
- **Wall tiles**: 10 segments (2 rows × 5 cols), mỗi segment 48×48px

### Props
- **Lamppost**: 1 frame, 48×48px → `props/prop_lantern_post.png`
- **Broken Mirror**: 1 frame, 48×48px → `props/prop_mirror_broken.png`
- **Chest Closed**: 1 frame, 48×48px → `props/prop_chest_closed.png`
- **Chest Open**: 1 frame, 48×48px → `props/prop_chest_open.png`

## Lưu ý
- Script sẽ tự động xóa nền trắng/đen
- Các frame được đặt tên theo format: `{base_name}_{number:02d}.png`
- Nếu cần điều chỉnh kích thước frame hoặc layout, sửa trong script

