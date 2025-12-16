# 🎮 Hướng dẫn Tổ chức Tất cả Assets

## 📋 Danh sách Assets cần xử lý

### 1. Dungeon Tileset (Floor + Walls)
- **File**: `dungeon-tileset.png`
- **Nội dung**: 
  - Floor tiles: cracked stone, moss, bloodstained (2x2 grids)
  - Wall tiles: brick walls với windows và doorways
- **Command**: 
  ```bash
  node split-tileset-assets.js dungeon dungeon-tileset.png ./client/public/assets
  ```

### 2. Mirror Sprites (3 States)
- **File**: `mirrors-sheet.png`
- **Nội dung**: 
  - Mirror intact
  - Mirror cracked
  - Mirror shattered
- **Command**: 
  ```bash
  node split-tileset-assets.js mirrors mirrors-sheet.png ./client/public/assets
  ```

### 3. Item Sprites
- **File**: `items-sheet.png`
- **Nội dung**: 
  - Potions (glowing + normal)
  - Pill bottles
  - Syringes
  - Crystals
- **Command**: 
  ```bash
  node split-tileset-assets.js items items-sheet.png ./client/public/assets
  ```

### 4. Prop Sprites
- **File**: `props-sheet.png`
- **Nội dung**: 
  - Ruin piles (9 variations)
  - Crates và barrels
  - Prison gates
  - Skeleton
- **Command**: 
  ```bash
  node split-tileset-assets.js props props-sheet.png ./client/public/assets
  ```

### 5. UI Elements
- **File**: `ui-elements-sheet.png`
- **Nội dung**: 
  - Inventory grid (golden frame)
  - Slot frames
  - Hand cursor
  - Arrows và star icons
- **Command**: 
  ```bash
  node split-tileset-assets.js ui ui-elements-sheet.png ./client/public/assets
  ```

## 🚀 Quick Start

### Bước 1: Đặt các sprite sheets vào thư mục gốc

```
hackathon_game-khoa_dev/
├── dungeon-tileset.png
├── mirrors-sheet.png
├── items-sheet.png
├── props-sheet.png
└── ui-elements-sheet.png
```

### Bước 2: Chạy từng command

```bash
# 1. Dungeon tileset
node split-tileset-assets.js dungeon dungeon-tileset.png ./client/public/assets

# 2. Mirrors
node split-tileset-assets.js mirrors mirrors-sheet.png ./client/public/assets

# 3. Items
node split-tileset-assets.js items items-sheet.png ./client/public/assets

# 4. Props
node split-tileset-assets.js props props-sheet.png ./client/public/assets

# 5. UI Elements
node split-tileset-assets.js ui ui-elements-sheet.png ./client/public/assets
```

### Bước 3: Kiểm tra kết quả

Sau khi chạy, bạn sẽ có cấu trúc:

```
client/public/assets/
├── tilesets/
│   ├── dungeon/
│   │   ├── floor/
│   │   │   ├── tile_floor_00.png
│   │   │   ├── tile_floor_01.png
│   │   │   └── ...
│   │   ├── walls/
│   │   │   └── ...
│   │   └── dungeon-tileset.json
│   └── props/
│       ├── prop_mirror_intact.png
│       ├── prop_mirror_cracked.png
│       ├── prop_mirror_shattered.png
│       ├── prop_ruin_pile_01.png
│       └── ...
├── items/
│   ├── consumables/
│   │   ├── icon_oil_flask_glowing.png
│   │   ├── icon_sanity_pill.png
│   │   └── ...
│   └── artifacts/
│       └── icon_memory_shard.png
└── ui/
    ├── frame_inventory_grid.png
    ├── frame_slot_01.png
    ├── cursor_hand.png
    └── ...
```

## ⚙️ Điều chỉnh Kích thước

Nếu kích thước tiles/sprites khác với mặc định (32×32), bạn cần sửa trong script:

1. Mở `split-tileset-assets.js`
2. Tìm các dòng có `tileWidth`, `tileHeight`
3. Điều chỉnh theo kích thước thực tế của sprite sheet

## 📝 Lưu ý

- Script sẽ tự động tạo metadata JSON cho mỗi loại asset
- Các file sẽ được đặt tên theo convention đã định nghĩa
- Nếu cần thay đổi tên file, sửa trong các hàm `organize*` tương ứng

## 🔧 Tùy chỉnh

Nếu layout của sprite sheet khác với mô tả, bạn có thể:

1. Sửa số `cols` và `rows` trong các hàm `splitTileset()`
2. Sửa danh sách tên trong các mảng `itemNames`, `propNames`, etc.
3. Điều chỉnh kích thước tile trong các hàm `organize*`

