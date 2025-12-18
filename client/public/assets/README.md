# Assets Directory Structure

Cấu trúc thư mục assets cho game **ASTEROS** - Dark Fantasy Retro Dungeon Crawler (16-bit Pixel Art Style).

## 📁 Cấu trúc

```
assets/
├── ui/                    # Giao diện người dùng (Pokémon Style)
├── characters/            # Nhân vật & Quái vật
│   ├── player/           # Sprites nhân vật chính
│   ├── npcs/             # NPCs
│   └── enemies/          # Quái vật & Boss
├── items/                 # Vật phẩm (Icons)
│   ├── consumables/      # Đồ tiêu thụ
│   ├── weapons/          # Vũ khí
│   ├── armor/            # Giáp
│   └── artifacts/        # Artifacts đặc biệt
├── tilesets/             # Bản đồ & Props
└── fx/                   # Hiệu ứng
```

## 🎨 Quy tắc đặt tên (Snake Case)

Tất cả file assets tuân thủ quy tắc **Snake Case**:
- Format: `category_name_variant.png`
- Ví dụ: `frame_dialogue_box.png`, `spr_seeker_idle_down.png`

## 📐 Kích thước chuẩn

- **UI Elements**: 16x16, 24x24, 32x32, 48x48
- **Character Sprites**: 32x32 (player), 64x64 (boss)
- **Item Icons**: 24x24 (consumables), 32x32 (weapons/armor)
- **Tiles**: 64x32 (isometric), 32x32 (props)
- **FX**: 64x64, 128x128, 256x256

## 🔧 Sử dụng trong Code

### TypeScript (Recommended)

```typescript
import { ASSET_PATHS } from '@/types/assets';

// Load texture trong PixiJS
const texture = await PIXI.Assets.load(ASSET_PATHS.ui.frameDialogueBox);
const sprite = new PIXI.Sprite(texture);
```

### JavaScript

```javascript
// Sử dụng asset-index.json
import assetIndex from '@/public/assets/asset-index.json';

const texture = await PIXI.Assets.load(`/assets/ui/${assetIndex.ui[0]}`);
```

## 📝 Metadata Files

Mỗi file `.png` có kèm file `.meta.txt` chứa thông tin:
- Kích thước mong muốn (width, height)
- Loại asset (placeholder/actual)
- Ghi chú

## 🎯 Next Steps

1. **Thay thế Placeholders**: Thay các file PNG placeholder bằng pixel art thật
2. **Tối ưu hóa**: Nén ảnh và tạo sprite sheets nếu cần
3. **Animation**: Tạo animation sheets cho characters (nếu chưa có)

## 🛠️ Regenerate Structure

Chạy lại script để tạo lại cấu trúc:

```bash
node generate-assets.js
```

**Lưu ý**: Script sẽ không ghi đè các file đã tồn tại, chỉ tạo file mới nếu thiếu.


