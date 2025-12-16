# Assets Structure - GBA Pokémon Style

Cấu trúc assets được tổ chức theo phong cách **Game Boy Advance Pokémon Gen 3** với sprite sheets và 9-slice UI.

## 🎮 Đặc điểm GBA Pokémon Style

### Sprite Sheets
- **Format**: Horizontal sprite sheets (frames nằm ngang)
- **Frames per animation**: 4 frames (GBA standard)
- **Player sprite sheet**: 32 frames total
  - 4 directions × 2 animations × 4 frames = 32 frames
  - Layout: `[Idle Down 0-3] [Idle Up 4-7] [Idle Left 8-11] [Idle Right 12-15] [Walk Down 16-19] [Walk Up 20-23] [Walk Left 24-27] [Walk Right 28-31]`

### 9-Slice UI
- **Dialogue Box**: Sử dụng 9-slice scaling (như Pokémon)
- **Border width**: 16px (GBA standard)
- **Pixel-perfect**: `PIXI.SCALE_MODES.NEAREST`

## 📁 Cấu trúc Sprite Sheets

### Player Sprite Sheet
```
spr_seeker_sheet.png (1024×32)
├── Frames 0-3:   Idle Down
├── Frames 4-7:   Idle Up
├── Frames 8-11:  Idle Left
├── Frames 12-15: Idle Right
├── Frames 16-19: Walk Down
├── Frames 20-23: Walk Up
├── Frames 24-27: Walk Left
└── Frames 28-31: Walk Right
```

### Metadata Files
Mỗi sprite sheet có file `.sheet.json`:
```json
{
  "frameCount": 32,
  "frameWidth": 32,
  "frameHeight": 32,
  "rows": 1,
  "cols": 32,
  "totalWidth": 1024,
  "totalHeight": 32,
  "style": "GBA Pokémon Gen 3"
}
```

## 🔧 Sử dụng trong Code

### Load Sprite Sheet

```typescript
import { loadSpriteSheetFromMeta, createAnimatedSprite, ASSET_PATHS } from '@/utils/assetLoader';

// Load player sprite sheet
const { textures, meta } = await loadSpriteSheetFromMeta(
  ASSET_PATHS.characters.player.mainSheet
);

// Tạo animated sprite
const sprite = createAnimatedSprite(textures.slice(0, 4), 0.15); // Idle Down
sprite.play();
```

### Sử dụng PlayerSprite Component

```typescript
import PlayerSprite from '@/components/game/PlayerSprite';

<PlayerSprite
  direction="down"
  animation="walk"
  x={100}
  y={100}
  scale={2}
/>
```

### GBA Dialogue Box

```typescript
import { GBADialogueBox } from '@/components/game/GBAStyleUI';

<GBADialogueBox
  text="Bạn nhìn vào gương..."
  speaker="Gương Vỡ"
  width={400}
  height={120}
/>
```

### GBA Health/Oil/Sanity Bars

```typescript
import { GBABar } from '@/components/game/GBAStyleUI';

<GBABar
  value={75}
  max={100}
  type="health"
  width={104}
  height={8}
/>
```

## 📐 Kích thước chuẩn GBA

- **Character sprites**: 32×32 pixels
- **Boss sprites**: 64×64 pixels
- **Item icons**: 24×24 (consumables), 32×32 (weapons/armor)
- **UI elements**: 16×16, 24×24, 32×32
- **Dialogue box**: 9-slice với border 16px
- **Bars**: 104×8 (container), 100×6 (fill)

## 🎨 Tạo Sprite Sheet từ Ảnh

Khi bạn có các frame riêng lẻ, hãy ghép chúng thành sprite sheet:

### Format yêu cầu:
1. **Horizontal layout**: Tất cả frames nằm ngang
2. **4 frames per animation**: GBA standard
3. **Pixel-perfect**: Không anti-aliasing
4. **Transparent background**: PNG với alpha channel

### Ví dụ với Aseprite/Photoshop:
- Tạo canvas: 1024×32 (cho player sheet)
- Đặt 32 frames, mỗi frame 32×32
- Export PNG với `nearest neighbor` scaling

## 🔄 Regenerate Structure

Chạy script để tạo lại cấu trúc:

```bash
node generate-assets-gba.js
```

## 📝 File Structure

```
assets/
├── ui/
│   ├── frame_dialogue_box_9slice.png + .json (9-slice metadata)
│   ├── frame_inventory_slot_*.png (rarity variants)
│   └── bar_*.png (health/oil/sanity)
├── characters/
│   ├── player/
│   │   ├── spr_seeker_sheet.png + .sheet.json (main sprite sheet)
│   │   └── spr_seeker_action_sheet.png + .sheet.json
│   ├── npcs/
│   │   └── *_sheet.png + .sheet.json
│   └── enemies/
│       └── *_sheet.png + .sheet.json
├── items/ (icons - không phải sprite sheets)
├── tilesets/ (tiles - không phải sprite sheets)
└── fx/
    └── *_sheet.png + .sheet.json (effect animations)
```

## 💡 Tips

1. **Animation Speed**: GBA thường dùng 0.1-0.2 cho walk animations
2. **Pixel Art**: Sử dụng palette 16-bit (GBA color limit)
3. **9-Slice**: Border 16px là chuẩn cho dialogue boxes
4. **Sprite Sheets**: Luôn dùng horizontal layout cho dễ load

