# ASTEROS - UI/UX Design Document (GDD)
## Game Design Document - Giao diện Người dùng & Trải nghiệm

---

## 📋 MỤC LỤC

1. [Hệ thống Thiết kế (Design System & Theme)](#1-hệ-thống-thiết-kế-design-system--theme)
2. [Phân tích Chi tiết từng Màn hình](#2-phân-tích-chi-tiết-từng-màn-hình)
3. [Trải nghiệm Người dùng (UX & Interactions)](#3-trải-nghiệm-người-dùng-ux--interactions)
4. [Kiến trúc Component](#4-kiến-trúc-component)

---

## 1. HỆ THỐNG THIẾT KẾ (Design System & Theme)

### 1.1. Màu sắc chủ đạo (Color Palette)

#### **Màu Nền (Background Colors)**
- **Đen tuyền (Pure Black)**: `#000000` / `#0a0a0a`
  - Sử dụng: Nền chính của game, modal backgrounds
  - Ý nghĩa: Bóng tối, hầm ngục, không gian vô tận

- **Xám than (Obsidian)**: `#1A1F2B` / `#18181b` / `#1a1a1a`
  - Sử dụng: Nền UI panels, HUD backgrounds
  - Ý nghĩa: Đá tối, tường hầm ngục

- **Xám đá (Steel)**: `#2D3A4A` / `#2a2a2a`
  - Sử dụng: Borders, secondary backgrounds
  - Ý nghĩa: Kim loại rỉ sét, đá xám

- **Xám nhạt (Mist Silver)**: `#A8B3C3` / `#627086`
  - Sử dụng: Text phụ, borders nhẹ
  - Ý nghĩa: Sương mù, ánh sáng yếu

#### **Màu Điểm nhấn (Accent Colors)**

##### **🔥 Vàng Cam (Amber) - Tài nguyên quan trọng nhất**
- **Amber chính**: `#D4A94E` / `#fbbf24` / `#ffb94a`
- **Amber đậm**: `#B38A3B` / `#b45309`
- **Amber nhạt**: `#fbbf24` / `#ffb94a`
- **Sử dụng**: 
  - Thanh Oil (Đèn Dầu) - tài nguyên sống còn
  - Borders của buttons quan trọng
  - Text highlights, warnings
  - Glow effects trên Oil bar
- **Ý nghĩa**: Ánh sáng, hy vọng, sự sống, ngọn lửa đèn lồng

##### **❤️ Đỏ Máu (Red) - Sức khỏe**
- **Đỏ chính**: `#E57373` / `#ef4444` / `#dc2626`
- **Đỏ đậm**: `#FF5555` / `#ff0000`
- **Sử dụng**:
  - Thanh Health (HP)
  - Icons tim (❤️)
  - Cảnh báo nguy hiểm
  - Status "ĐÃ CHẾT"
- **Ý nghĩa**: Máu, nguy hiểm, sự sống/chết

##### **👁️ Tím Huyền bí (Purple) - Tinh thần**
- **Tím chính**: `#9d4edd` / `#9333ea` / `#7c3aed`
- **Sử dụng**:
  - Thanh Sanity (Tinh thần)
  - Hiệu ứng glitch khi Sanity thấp
  - Codes, items đặc biệt
- **Ý nghĩa**: Bóng tối, mất trí, huyền bí, void

##### **✅ Xanh Lá (Green) - Thành công**
- **Xanh chính**: `#4CAF50` / `#50fa7b` / `#22c55e`
- **Sử dụng**:
  - Status "CÒN SỐNG"
  - Thông báo thành công
  - Wallet address display
  - Positive feedback

##### **⚠️ Vàng Cảnh báo (Yellow)**
- **Vàng chính**: `#FFB84D` / `#fbbf24`
- **Sử dụng**: Warnings, low Oil alerts

#### **Màu Text**
- **Text chính**: `#E9ECF2` / `#F0F2FA` (Trắng xám)
- **Text phụ**: `#C0C5CF` / `#a8b3c3` (Xám nhạt)
- **Text mờ**: `#627086` / `#64748b` (Xám đá)

### 1.2. Typography

#### **Font chữ chính**
- **Font Pixel**: `'TwistyPixelVN'` (LNTH Twisty Pixel Việt hóa)
  - File: `/fonts/0307-LNTH-TwistyPixel.ttf`
  - Sử dụng: Tất cả UI elements, buttons, HUD, text game
  - Letter spacing: `0.04em`
  - Style: Retro pixel art, blocky, sharp edges

- **Font Body**: `VT323` (Google Fonts)
  - Sử dụng: Body text, descriptions (nếu có)
  - Style: Retro terminal, monospace

- **Font Fallback**: `Press Start 2P` (Google Fonts)
  - Sử dụng: Fallback cho pixel text
  - Style: Classic 8-bit arcade

#### **Kích thước chữ**
- **H1 (Titles)**: `text-4xl` - `text-7xl` (24px - 72px)
- **H2 (Section titles)**: `text-2xl` - `text-4xl` (24px - 36px)
- **H3 (Subsection)**: `text-xl` - `text-2xl` (20px - 24px)
- **Body**: `text-sm` - `text-lg` (14px - 18px)
- **Small/Captions**: `text-[10px]` - `text-xs` (10px - 12px)
- **Tiny (HUD stats)**: `text-[8px]` - `text-[10px]` (8px - 10px)

#### **Font weights**
- **Bold**: `font-bold` - Cho titles, important text
- **Normal**: Default - Cho body text
- **Mono**: `font-mono` - Cho numbers, IDs, addresses

### 1.3. Phong cách Nghệ thuật (Art Direction)

#### **Tổng quan**
- **Theme**: **Dark Fantasy Retro Dungeon Crawler**
- **Vibe**: Lovecraftian Horror + Isometric Pixel Art + Web3
- **Inspiration**: Diablo 1, Darkest Dungeon, classic roguelikes

#### **Đặc điểm Visual**
1. **Pixel Art Style**:
   - Tất cả graphics sử dụng pixel-perfect rendering
   - `image-rendering: crisp-edges` và `pixelated`
   - Không anti-aliasing (antialias: false trong PixiJS)
   - Borders sắc nét, không bo tròn quá mức

2. **Dark & Atmospheric**:
   - Nền tối tuyệt đối với particles floating
   - Fog layers tạo độ sâu
   - Shadows và glows tạo không khí ma mị

3. **Isometric Perspective**:
   - Game map sử dụng isometric grid (64x32 pixels per tile)
   - Tạo cảm giác 3D trong không gian 2D
   - Phù hợp với dungeon crawler

4. **Retro UI Elements**:
   - Borders dày (2px - 4px)
   - Shadow 3D effect: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]`
   - Buttons có hiệu ứng "press down" (active:translate-y-1)
   - Pixelated textures cho backgrounds

#### **Material Design Language**
- **Borders**: Thick, pixelated, thường là 2-4px
- **Shadows**: Hard shadows, không blur (pixel style)
- **Gradients**: Subtle, thường dùng cho bars và backgrounds
- **Transparency**: Sử dụng `backdrop-blur-sm` cho glassmorphism effect

---

## 2. PHÂN TÍCH CHI TIẾT TỪNG MÀN HÌNH

### 2.1. Màn hình Chào (Landing Page) - `/`

#### **Layout Structure**
```
┌─────────────────────────────────────────┐
│  [Navbar với ASTEROS logo]             │
├─────────────────────────────────────────┤
│                                         │
│         [Hero Section]                  │
│    "Break the Lantern. Break the Loop" │
│         [CTA Buttons]                   │
│                                         │
├─────────────────────────────────────────┤
│  [Intro Section]                        │
│  [Gameplay Section]                     │
│  [Features Section]                     │
│  [Character Section]                    │
│  [News Section]                         │
├─────────────────────────────────────────┤
│  [Footer]                               │
└─────────────────────────────────────────┘
```

#### **Hero Section**
- **Background**: 
  - PixiJS animated background với particles
  - Dark gradient từ đen đến xám than
  - Floating particles (vàng cam, tím, đỏ, xám)

- **Content**:
  - **Title**: "Break the Lantern. Break the Loop."
    - Font: Pixel, size: 4xl-7xl
    - Gradient text: từ amber-300 đến amber-700
    - Drop shadow: `drop-shadow-[4px_4px_0_rgba(0,0,0,1)]`
  
  - **Subtitle**: Mô tả game
    - Text color: zinc-200
    - Max width: xl

  - **CTA Buttons**:
    - Style: Border 2px, rounded-lg
    - Hover: border-amber-400, bg-amber-600/30, scale-105
    - Font: Pixel, bold

#### **Navigation Bar (Public)**
- **Logo**: 
  - Circular icon với chữ "A" màu amber
  - Background: `#26293A`, border: `#7A84A2`
  - Size: 16x16 (64px x 64px)

- **Title**: "ASTEROS"
  - Font: Pixel, size: 35px
  - Color: `#F0F2FA`

- **Menu Items**: 
  - Background: `#1E2130/50` với backdrop-blur
  - Border: 2px white, rounded-2xl
  - Hover: `#C7B4FF/20` với shadow-lg

- **Background**: PixiJS animated với:
  - Dungeon brick pattern (40x20px bricks)
  - Moss/stains effects
  - Pixel shader filter

### 2.2. Màn hình Xác thực (Auth) - `/auth`

#### **Layout**
- **Background**: 
  - Radial gradient từ zinc-800/20 → black
  - Grid pattern overlay (30x30px)
  - Mask radial gradient

- **Content Box**:
  - Background: `zinc-900/90`
  - Border: 4px `zinc-800`
  - Rounded: xl
  - Padding: p-8

- **Login Area**:
  - Sui Wallet Connect button
  - Custom styling: Amber background, black text
  - 3D button effect với shadow

### 2.3. Màn hình User Dashboard - `/user`

#### **Layout Structure**
```
┌─────────────────────────────────────────┐
│  [UserNavbar]                          │
│  - Logo ASTEROS                         │
│  - Menu: Trang chủ, Chơi, Game, Tin tức│
│  - Wallet: 0.96 SUI | 0x024...908e     │
│  - Logout button                        │
├─────────────────────────────────────────┤
│  [UserHeroSection]                     │
│  "Chào mừng trở lại, Seeker."          │
│  [Buttons: TIẾP TỤC RUN, VÀO GAME, ...]│
├─────────────────────────────────────────┤
│  [Progress Overview] [Tasks Section]    │
│  [Lore Section]      [Tips Section]    │
│  [News Section]      [Community]       │
├─────────────────────────────────────────┤
│  [UserFooter]                           │
└─────────────────────────────────────────┘
```

#### **Navbar Background**
- **PixiJS Dungeon Background**:
  - Dark stone base: `#2a2a2a`
  - Brick pattern: 40x20px với offset
  - Moss stains: `#1a2e1a` với alpha 0.4
  - Pixel shader filter (pixelSize: 60.0)
  - Animated particles floating

#### **UserHeroSection**
- **Background**: `zinc-900/70`, border `zinc-800`
- **Title**: "Chào mừng trở lại, Seeker."
  - Color: amber-300, size: 4xl
- **Subheading**: Dynamic dựa trên Sanity level
- **Action Buttons**:
  - Primary: `bg-amber-400`, `text-zinc-900`
  - Secondary: `bg-zinc-700`, `text-zinc-200`

### 2.4. Màn hình Chơi chính (Gameplay UI) - `/play`

#### **Layout Structure - Mode Selection**
Khi chưa vào game (`showGame = false`):
```
┌─────────────────────────────────────────┐
│  [GameBackground - PixiJS particles]   │
├─────────────────────────────────────────┤
│                                         │
│         "Chơi" (Title)                  │
│                                         │
│      [GameHUD Panel]                    │
│      - Avatar 🧙‍♂️                        │
│      - Health Bar ❤️                     │
│      - Oil Bar 🔥                        │
│      - Sanity Bar 👁️                    │
│      - Status: CÒN SỐNG                  │
│                                         │
│      [GameActions Buttons]              │
│      - TIẾN VÀO BÓNG TỐI (-10 Oil)      │
│      - RESET OIL (MINT MỚI)             │
│                                         │
│      [VÀO GAME STORY MODE Button]        │
│                                         │
└─────────────────────────────────────────┘
```

#### **Layout Structure - Game Mode** (`showGame = true`)
```
┌─────────────────────────────────────────────────────────┐
│  [Isometric Game Canvas - Layer 0]                     │
│  - MirrorHallwayGame với PixiJS                         │
│  - Isometric tiles, player sprite, mirrors              │
├─────────────────────────────────────────────────────────┤
│  [HUD Layer - Layer 1]                                  │
│  ┌─────────────┐                                        │
│  │ GameHUD     │                                        │
│  │ (Top Left)  │                                        │
│  │ - Avatar 🧙‍♂️ │                                        │
│  │ - Health ❤️ │                                        │
│  │ - Oil 🔥     │                                        │
│  │ - Sanity 👁️ │                                        │
│  │ - Status    │                                        │
│  └─────────────┘                                        │
│                                                         │
│  [LightSlider - Center Bottom]                          │
│  ┌─────────────────────────────────────┐              │
│  │ 👁️ Ẩn nấp | 🕯️ Bình thường | ☀️ Sự thật │              │
│  │ [============●========] 50%          │              │
│  │ Oil x1.0 | Sanity x1.0                │              │
│  └─────────────────────────────────────┘              │
│                                                         │
│  [Action Log - Above LightSlider]                       │
│  > Bạn vừa bước vào...                                 │
│  > HP +10                                               │
│                                                         │
│  [ActionConsole - Bottom Right]                         │
│  ┌─────────────────────────┐                          │
│  │ Bảng Điều Khiển         │                          │
│  │ [👣 Move] [😴 Rest]     │                          │
│  │ [🔍 Search] [⚔️ Attack] │                          │
│  │ [💡 Focus] [💬 Whisper]  │                          │
│  │ ┌─────────────────────┐ │                          │
│  │ │ > Log messages...   │ │                          │
│  │ └─────────────────────┘ │                          │
│  └─────────────────────────┘                          │
│                                                         │
│  [🎒 Inventory Button - Top Right]                      │
└─────────────────────────────────────────────────────────┘
```

#### **GameHUD Component (Góc trái trên)**

**Kích thước & Vị trí**:
- Position: `absolute top-4 left-4`
- Min width: `260px` (tăng từ 240px)
- Background: `black/80` (80% opacity)
- Border: `2px zinc-600`
- Shadow: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]` (3D effect)

**Cấu trúc**:
1. **Avatar & Info Section**:
   - Avatar frame: `w-14 h-14` (56x56px) - **Pixel Art Style**
     - Background: `zinc-800` với gradient `from-amber-600 via-amber-700 to-amber-800`
     - Border: `border-2 border-zinc-500`
     - Icon: 🧙‍♂️ (wizard emoji) - placeholder, có thể thay bằng pixel art image
     - Shadow: `shadow-inner`
     - **Ancient frame effect**: 
       - Corner decorations: 4 góc có `w-2 h-2 bg-amber-600/50`
       - Inner border: `border-2 border-amber-600/30`
   - Title: "THE SEEKER"
     - Color: `amber-500`
     - Font: Pixel, size: `text-sm`
   - ID: `ID: {lanternId.slice(0,6)}...`
     - Color: `zinc-500`
     - Font: Mono, size: `text-[10px]`
   - Border bottom: `border-b border-zinc-700`

2. **Stats Bars Section**:
   
   **Health Bar**:
   ```
   ┌─────────────────────────────────┐
   │ ❤️ Sức khỏe          100/100    │
   │ ┌─────────────────────────────┐ │
   │ │█████████████████████████████│ │ ← Red bar với glow
   │ └─────────────────────────────┘ │
   └─────────────────────────────────┘
   ```
   - Height: `h-3` (12px)
   - Color: `bg-red-600` với `shadow-[0_0_8px_rgba(220,38,38,0.6)]`
   - Highlight: Top border `h-[2px] bg-white/20`
   
   **Oil Bar (Quan trọng nhất)**:
   ```
   ┌─────────────────────────────────┐
   │ 🔥 Đèn Dầu          100/100      │
   │ ┌─────────────────────────────┐ │
   │ │█████████████████████████████│ │ ← Liquid effect
   │ │  OIL LEVEL (hoặc ⚠️ LOW)     │ │ ← Text overlay
   │ └─────────────────────────────┘ │
   └─────────────────────────────────┘
   ```
   - Height: `h-6` (24px) - **Lớn hơn các bar khác**
   - Color: Gradient `from-yellow-600 via-amber-500 to-amber-400`
   - Glow: `shadow-[0_0_10px_rgba(245,158,11,0.3)]`
   - **Liquid Effects**:
     - Water gradient: `from-transparent via-white/20 to-transparent`
     - Ripple effect: Bottom border `h-1 bg-white/30 animate-pulse`
   - **Warning State** (< 20%):
     - Border: Đổi sang `border-red-600`
     - Animation: `animate-pulse`
     - Text overlay: "⚠️ LOW" thay vì "OIL LEVEL"
     - Value text: `text-red-400 animate-pulse`
   
   **Sanity Bar (Glitch Effect)**:
   ```
   ┌─────────────────────────────────┐
   │ 👁️ Tinh thần        100/100      │
   │ ┌─────────────────────────────┐ │
   │ │█████████████████████████████│ │ ← Purple với glitch
   │ └─────────────────────────────┘ │
   └─────────────────────────────────┘
   ```
   - Height: `h-4` (16px)
   - Color: `bg-gradient-to-r from-purple-600 to-purple-400`
   - **Glitch Effect** (khi < 50%):
     - Animation: `animate-pulse`
     - Glitch overlay: `from-transparent via-white/30 to-transparent`
     - Red flash: `bg-red-500/20` khi glitch active
     - Text shake: `translate-x-1` khi glitch
   - Border: `border-purple-700`

3. **Status Section**:
   - Border top: `border-t border-zinc-700`
   - Label: "TRẠNG THÁI", `text-[10px]`, `zinc-500`
   - Value: "CÒN SỐNG" (green-400) hoặc "ĐÃ CHẾT" (red-400)
     - Font: Bold, Pixel, `text-[10px]`

#### **DungeonGameHUD Component (Alternative HUD)**

**Khác biệt với GameHUD**:
- **Health**: Hiển thị bằng 5 quả tim (❤️) thay vì bar
  - Heart count: `Math.ceil((hp/100) * 5)`
  - Màu: `red-500` (filled) hoặc `zinc-700` (empty)

- **Oil**: Bình thủy tinh với mực nước
  - Height: `h-6` (24px)
  - Border: `border-2 border-amber-700` (hoặc `border-red-600` khi < 20%)
  - Glow: `shadow-[0_0_10px_rgba(245,158,11,0.3)]`
  - Text overlay: "OIL LEVEL" hoặc "⚠️ LOW" (khi < 20%)
  - Water effect: Gradient từ transparent → white/20 → transparent

- **Sanity**: Thanh với glitch effect khi thấp
  - Glitch: `animate-pulse` khi < 30%
  - Gradient overlay: `from-transparent via-white/30 to-transparent`

- **Mini-map** (Góc phải trên):
  - Grid: 4x4 (16 rooms)
  - Current room: `bg-amber-500`, `animate-pulse`, icon 🔥
  - Visited rooms: `bg-zinc-700`
  - Unexplored: `bg-zinc-900`, `opacity-50`
  - Compass: 🧭 "Hướng: Bắc"

#### **Isometric Game Canvas (Layer 0)**

**MirrorHallwayGame Component**:
- **Background**: `#0a0a0f` (dark blue-black)
- **Tile System**:
  - Tile size: 64x32 pixels (isometric)
  - Floor tiles: Alternating `#1a1a2e` và `#16213e`
  - Border: `#0f0f1a` với alpha 0.5

- **Mirror Walls**:
  - Left wall: `#4a5568` (gray)
  - Right wall: `#4a5568`
  - Cracks: Dark lines (`#2d3748`)
  - Reflection effect: Lighter shade

- **Player Sprite**:
  - Position: Grid-based, converted to isometric
  - Color: Yellow (`#ffb94a`)
  - Size: Blocky pixel art
  - Animation: Smooth movement between tiles

- **Dialog System**:
  - Background: `zinc-900` với `border-4 border-amber-600`
  - Title: "🪞 HÀNH LANG GƯƠNG"
  - Text: `text-zinc-200`, `leading-relaxed`
  - Choice buttons:
    - Background: `zinc-800`
    - Hover: Color-coded (red/blue/purple)
    - Border: `border-2 border-zinc-600`
    - Active: `translate-y-1`

#### **LightSlider Component (Góc dưới giữa) - CƠ CHẾ CỐT LÕI**

**Vị trí**: `absolute bottom-32 left-1/2 -translate-x-1/2`

**Kích thước & Style**:
- Min width: `300px`
- Background: `black/80` với `backdrop-blur-sm`
- Border: `border-2 border-amber-600`
- Shadow: `shadow-lg`

**Cấu trúc**:
1. **Header**:
   - Mode icon: 👁️ (Stealth), 🕯️ (Normal), ☀️ (Truth)
   - Mode name: "Ẩn nấp" / "Bình thường" / "Sự thật"
   - Stats: `{lightLevel}% | Oil x{rate} | Sanity x{rate}`
     - Font: Mono, `text-[10px]`, `zinc-500`

2. **Slider Track**:
   - Height: `h-4` (16px)
   - Background: `zinc-900` với `border-zinc-600`
   - Fill color theo mode:
     - Stealth: `bg-blue-600`
     - Normal: `bg-amber-400`
     - Truth: `bg-amber-500` với pulse effect
   - Glow: `shadow-[0_0_10px_rgba(245,158,11,0.5)]`

3. **Thumb Indicator**:
   - Size: `w-6 h-6` (24x24px)
   - Color: `bg-amber-400` với `border-2 border-amber-600`
   - Glow: Tăng intensity khi Truth mode
   - Animation: Pulse effect khi Truth

4. **Mode Labels**:
   - 0%, 30%, 70%, 100%
   - Active mode label: Highlighted với mode color

5. **Mode Description**:
   - Font: Pixel, `text-[10px]`, `zinc-400`
   - Text thay đổi theo mode

**Logic Gameplay**:
- **Stealth Mode (0-30%)**:
  - Oil consumption: 50% (tiết kiệm)
  - Sanity drain: 100% (bình thường)
  - Visual: Screen brightness giảm 40% (`brightness(0.6)`)
  - Risk: Tăng nguy cơ bị tấn công, dễ dẫm bẫy

- **Normal Mode (31-70%)**:
  - Oil consumption: 100% (bình thường)
  - Sanity drain: 100% (bình thường)
  - Visual: Screen brightness bình thường (`brightness(1.0)`)
  - Balance: Cân bằng giữa ánh sáng và tài nguyên

- **Truth Mode (71-100%)**:
  - Oil consumption: 200% (tốn gấp đôi)
  - Sanity drain: 150% (giảm nhanh)
  - Visual: Screen brightness tăng 20% (`brightness(1.2)`)
  - Benefit: Nhìn thấy sự thật, nhận lore ẩn, thấy ảo giác → sự thật

**Visual Effects**:
- Brightness filter: Áp dụng cho toàn màn hình
- Liquid animation: Cho Truth mode fill
- Pulse: Cho Truth mode thumb

#### **ActionConsole Component (Góc dưới phải) - RPG-STYLE**

**Vị trí**: `absolute bottom-4 right-4`

**Kích thước & Style**:
- Min width: `320px`, Max width: `400px`
- Background: `black/90`
- Border: `border-4 border-zinc-600`
- Shadow: `shadow-2xl`
- Font: Pixel

**Cấu trúc**:
1. **Header**:
   - Title: "Bảng Điều Khiển"
     - Color: `amber-400`
     - Font: Pixel, `text-sm`, uppercase
   - Border bottom: `border-b-2 border-zinc-700`

2. **Action Buttons Grid** (2x2):
   - **Move** (👣):
     - Background: `zinc-800`
     - Border: `border-2 border-zinc-600`
     - Hover: `hover:border-amber-500`
     - Disabled: Khi không thể di chuyển
   
   - **Rest** (😴):
     - Background: `zinc-800`
     - Hover: `hover:border-green-500`
     - Effect: Hồi Sanity, mất Oil
   
   - **Search** (🔍):
     - Background: `zinc-800`
     - Hover: `hover:border-blue-500`
     - Effect: Tìm kiếm items, codes
   
   - **Attack** (⚔️):
     - Background: `red-900`
     - Border: `border-2 border-red-600`
     - Hover: `hover:border-red-400`

3. **Special Actions** (nếu có):
   - **Focus Light** (💡):
     - Background: `amber-900`
     - Border: `border-2 border-amber-600`
     - Disabled: Khi Oil < 10
     - Effect: Làm choáng kẻ địch, tốn 10 Oil
   
   - **Whisper** (💬):
     - Background: `purple-900`
     - Border: `border-2 border-purple-600`
     - Disabled: Khi Sanity < 20
     - Effect: Dùng Memory Shard, tốn 20 Sanity

4. **Log Window**:
   - Background: `black/60`
   - Border: `border-2 border-zinc-700`
   - Height: `h-24` (96px)
   - Overflow: `overflow-y-auto`
   - Content:
     - Font: Pixel, `text-[10px]`, `zinc-300`
     - Auto-scroll: Tự động scroll đến log mới nhất
     - Max entries: 10 logs
     - HTML support: Có thể chứa `<span>` với colors

**Interactions**:
- Click action: Thêm log vào window và gọi callback
- Disabled states: Visual feedback rõ ràng
- Hover effects: Border đổi màu theo action type

#### **Action Log Component (Above LightSlider)**

**Vị trí**: `absolute bottom-24 left-1/2 -translate-x-1/2`

**Style**:
- Container: `flex flex-col-reverse gap-1`
- Each log entry:
  - Background: `black/60`
  - Border: `border-amber-600/30`
  - Padding: `px-4 py-1`
  - Border radius: `rounded-full` (pill shape)
  - Font: Pixel, `text-sm`
  - Shadow: `shadow-lg`
  - Animation: `animate-fade-in`
  - Opacity: `1 - i * 0.3` (fade out cho logs cũ)

**Content**:
- Prefix: `&gt; ` (>) 
- HTML support: Có thể chứa `<span>` với colors
- Max entries: 5 (default)

**Initial message**: "Bạn vừa bước vào một căn phòng lạnh lẽo..."

#### **Inventory Button (Góc trên phải)**

**Vị trí**: `absolute top-4 right-4`

**Style**:
- Size: `h-12 w-12` (48x48px)
- Background: `zinc-800`
- Border: `border-2 border-zinc-500`
- Hover: `hover:bg-zinc-700 hover:border-amber-400`
- Icon: 🎒, size: `text-xl`
- Badge: Red circle với số lượng items
  - Position: `absolute -top-1 -right-1`
  - Background: `red-600`
  - Size: `w-5 h-5`
  - Font: Pixel, `text-[10px]`

### 2.5. Inventory Modal (Kho đồ)

#### **Layout Structure**
```
┌─────────────────────────────────────────┐
│  [Backdrop: black/70, backdrop-blur]  │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐  │
│  │ 🎒 HÀNH TRANG              [X]  │  │ ← Header
│  ├─────────────────────────────────┤  │
│  │ ┌─────────┐  ┌─────────┐       │  │
│  │ │ [Grid]  │  │ [Detail]│       │  │
│  │ │ 5x4     │  │ Panel   │       │  │
│  │ │ 20 slots│  │         │       │  │
│  │ └─────────┘  └─────────┘       │  │
│  │                                 │  │
│  │ Vàng: 100                       │  │ ← Footer
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### **Modal Container**
- **Size**: `w-[600px]`
- **Background**: `zinc-900`
- **Border**: `border-4 border-zinc-600`
- **Shadow**: `shadow-2xl`
- **Position**: Centered, `z-50`

#### **Header**
- **Background**: `zinc-800`
- **Border bottom**: `border-b-4 border-zinc-700`
- **Title**: "🎒 HÀNH TRANG"
  - Font: Pixel, `text-lg`, white
- **Close button**: 
  - Color: `red-400`
  - Hover: `red-200`
  - Size: `text-xl`, bold "X"

#### **Grid System (Left Column)**
- **Layout**: `grid grid-cols-5 gap-2`
- **Total slots**: 20 (5 columns x 4 rows)
- **Slot size**: `aspect-square`
- **Height**: `h-[300px]` với `overflow-y-auto`
- **Background**: `black/40`

**Rarity System**:
- **Common** (Xám):
  - Border: `border-zinc-500`
  - Background: `bg-zinc-800`
  - Text: `text-zinc-300`
  - Glow: `shadow-[0_0_5px_rgba(161,161,170,0.3)]`

- **Rare** (Xanh dương):
  - Border: `border-blue-500`
  - Background: `bg-blue-900/30`
  - Text: `text-blue-300`
  - Glow: `shadow-[0_0_10px_rgba(59,130,246,0.5)]`

- **Epic** (Tím):
  - Border: `border-purple-500`
  - Background: `bg-purple-900/30`
  - Text: `text-purple-300`
  - Glow: `shadow-[0_0_15px_rgba(168,85,247,0.6)]`

- **Legendary** (Cam):
  - Border: `border-amber-500`
  - Background: `bg-amber-900/30`
  - Text: `text-amber-300`
  - Glow: `shadow-[0_0_20px_rgba(245,158,11,0.8)]`

- **Cursed** (Đỏ thẫm):
  - Border: `border-red-800`
  - Background: `bg-red-900/40`
  - Text: `text-red-400`
  - Glow: `shadow-[0_0_15px_rgba(127,29,29,0.6)]`

**Slot States**:
1. **Empty slot**:
   - Background: `zinc-900/50`
   - Border: `border-zinc-800`
   - Opacity: `opacity-50`

2. **Filled slot**:
   - Background: Theo rarity
   - Border: Theo rarity
   - Hover: Border và glow tăng intensity
   - Icon: Item icon (emoji), size: `text-2xl`, màu theo rarity
   - **Rarity indicator**: Dot ở góc trên phải
     - Size: `w-2 h-2`
     - Color: Theo rarity border color
   - Tooltip: Hiện khi hover
     - Background: `black`
     - Border: Theo rarity
     - Text: Màu theo rarity
     - Font: Pixel, `text-[10px]`
     - Content: Item name + rarity label (uppercase)
     - Position: `bottom-full mb-2`

3. **Selected slot**:
   - Border: Theo rarity với intensity cao
   - Shadow: Glow effect theo rarity
   - Background: Sáng hơn một tone

#### **Detail Panel (Right Column)**
- **Width**: `w-1/3`
- **Border left**: `border-l-2 border-zinc-600`
- **Padding**: `pl-4`

**Content khi có item selected**:
1. **Title & Rarity Badge**:
   - Title: Item name
     - Color: Theo rarity (từ RARITY_COLORS)
     - Font: Pixel, `text-xl`
   - Rarity badge: 
     - Background: Theo rarity bg
     - Border: Theo rarity border
     - Text: Uppercase rarity name
     - Font: Pixel, `text-[10px]`
     - Padding: `px-2 py-1`

2. **Icon**: Item icon
   - Size: `text-4xl`
   - Color: Theo rarity text color

3. **Description**: 
   - Color: `zinc-400`
   - Size: `text-sm`
   - Font: Pixel
   - `leading-relaxed`

4. **Effects Section**:
   - Label: "HIỆU ỨNG:", `text-xs`, `zinc-500`, Font: Pixel
   - HP: `text-red-400`
   - Oil: `text-amber-400`
   - Sanity: `text-purple-400`

5. **Action Buttons**:
   - **SỬ DỤNG**: 
     - Background: `green-900`
     - Border: `border-2 border-green-600`
     - Hover: `hover:bg-green-800`
     - Active: `active:translate-y-0.5`
     - Font: Pixel
   - **VỨT BỎ**:
     - Background: `red-900`
     - Border: `border-2 border-red-600`
     - Hover: `hover:bg-red-800`
     - Font: Pixel

**Content khi không có item selected**:
- Placeholder text: "Chọn một vật phẩm để xem chi tiết..."
- Color: `zinc-500`, `text-xs`, centered

#### **Footer**
- **Border top**: `border-t border-zinc-600`
- **Currency**: "Vàng: 100"
  - Label: `amber-400`
  - Value: `white`
- **Hint**: "Kéo thả hoặc nhấn đúp để sử dụng vật phẩm."
  - Color: `zinc-500`, `text-xs`, centered

### 2.6. Màn hình Game Full - `/game`

#### **Layout Structure**
```
┌─────────────────────────────────────────┐
│  [GameBackground - intensity: high]    │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ [HUD]    │  │ [Game Canvas]        │ │
│  │ Sidebar  │  │ MirrorHallwayGame    │ │
│  │          │  │                      │ │
│  │          │  │ [Results Box]        │ │
│  └──────────┘  └──────────────────────┘ │
├─────────────────────────────────────────┤
│  [Navigation: ← Về User | Chế độ Play] │
└─────────────────────────────────────────┘
```

**Khác biệt với `/play`**:
- Layout 2 cột: HUD sidebar bên trái, game canvas bên phải
- HUD sidebar: `w-72`, `bg-zinc-900/80`, `border-r-2 border-amber-700`
- Results box: Góc trên phải của game canvas
- Navigation: Bottom left, offset từ sidebar

---

## 3. TRẢI NGHIỆM NGƯỜI DÙNG (UX & Interactions)

### 3.1. Hover Effects

#### **Buttons**
- **Standard buttons**:
  - Hover: Background sáng hơn, border đổi màu
  - Scale: `hover:scale-105` (5% larger)
  - Transition: `transition-all duration-300`

- **Action buttons**:
  - Hover: Border đổi sang accent color (amber/red/purple)
  - Background: Sáng hơn một tone
  - Shadow: Tăng shadow

- **Inventory slots**:
  - Hover: Border `amber-400`, background `zinc-700`
  - Tooltip: Hiện tên item

#### **Navigation Items**
- Hover: Background `#C7B4FF/20` với `shadow-lg`
- Transition: `duration-200`

### 3.2. Active/Press Effects

#### **Buttons**
- **Press down**: `active:translate-y-1` hoặc `active:scale-95`
- **3D effect**: Shadow giảm khi press
  - Normal: `shadow-lg`
  - Active: `shadow-md` hoặc `shadow-none`

#### **Custom Connect Button**
- Normal: `box-shadow: 0 4px 0 #b45309`
- Hover: `box-shadow: 0 6px 0 #b45309`, `translateY(-2px)`
- Active: `box-shadow: 0 0 0 #b45309`, `translateY(4px)`

### 3.3. Visual Feedback

#### **Health Bar**
- **Low health**: Có thể thêm pulse effect (chưa implement)
- **Color**: Đỏ với glow effect

#### **Oil Bar**
- **Low oil (< 20%)**:
  - Border: Đổi sang `red-600`
  - Animation: `animate-pulse`
  - Text overlay: "⚠️ LOW" thay vì "OIL LEVEL"
  - Glow: Tăng intensity

#### **Sanity Bar**
- **Low sanity (< 50%)**:
  - Animation: `animate-pulse`
  - **Glitch effect**: 
    - Gradient overlay: `from-transparent via-white/30 to-transparent`
    - Red flash: `bg-red-500/20` khi glitch active
    - Text shake: `translate-x-1` khi glitch
    - Interval: 200ms toggle
  - Visual: Tạo cảm giác "unstable", "unreliable narrator"

#### **Status Indicator**
- **Alive**: Green (`green-400`)
- **Dead**: Red (`red-400`)
- Font: Bold, Pixel

### 3.4. Loading States

#### **GameHUD**
- **Loading**: Hiển thị "Đang kiểm tra ví..."
  - Color: `zinc-400`
  - Font: Pixel

- **Error**: "Lỗi khi đọc dữ liệu Blockchain."
  - Color: `red-400`

#### **Wallet Balance**
- **Loading**: Hiển thị "..." 
- **Display**: `{balance} SUI` với 4 decimal places

### 3.5. Disabled States

#### **Buttons**
- **Opacity**: `opacity-50`
- **Cursor**: `cursor-not-allowed`
- **Visual**: Mờ đi, không có hover effects

#### **Move Button**
- **Indicator**: Red dot với pulse khi không thể di chuyển
  - Position: `absolute -top-1 -right-1`
  - Size: `w-4 h-4`
  - Animation: `animate-pulse`

### 3.6. Particle Effects

#### **ButtonParticleEffect**
- **Trigger**: Khi hover button
- **Particles**: 
  - Color: Tùy button (amber cho move, orange cho reset)
  - Size: 2-5px (random)
  - Movement: Random velocity
  - Life: 20-35 frames
  - Alpha: Fade out theo life

#### **GameBackground Particles**
- **Count**: 30-100 particles (tùy intensity)
- **Colors**: 
  - `0xffb94a` (amber - đèn)
  - `0x9d4edd` (purple - sanity)
  - `0xef4444` (red - hp)
  - `0x64748b` (gray)
- **Movement**: Random velocity, wrap around screen
- **Life**: 60-180 frames với fade out

#### **Fog Layers**
- **Count**: 3 layers
- **Color**: `0x1a1a2e` với alpha 0.1-0.2
- **Movement**: Horizontal scroll với different speeds
- **Effect**: Tạo depth và atmosphere

### 3.7. Modal Interactions

#### **Inventory Modal**
- **Open**: Click inventory button (🎒)
- **Close**: 
  - Click X button
  - Click backdrop (outside modal)
- **Backdrop**: `bg-black/70` với `backdrop-blur-sm`
- **Animation**: Fade in (có thể thêm slide)

#### **Dialog (MirrorHallwayGame)**
- **Background overlay**: `bg-black/80`
- **Modal**: 
  - Background: `zinc-900`
  - Border: `border-4 border-amber-600`
  - Padding: `p-6`
  - Max width: `max-w-2xl`

### 3.8. Log System

#### **ActionLog Component**
- **Add log**: Sử dụng `addGameLog(message, type)` function
- **Event system**: Custom event `addGameLog`
- **Auto-scroll**: Tự động scroll đến log mới nhất
- **Fade effect**: Logs cũ mờ dần (opacity giảm)
- **HTML support**: Có thể dùng `<span>` với colors

#### **Log Types**
- **info**: Default, `text-zinc-300`
- **warning**: `text-yellow-400`
- **success**: `text-green-400`
- **error**: `text-red-400`

### 3.9. Responsive Design

#### **Mobile (< 768px)**
- **Navbar**: Hamburger menu
- **Buttons**: Smaller padding (`py-2` thay vì `py-4`)
- **Font sizes**: Giảm 10-20%
- **Grid layouts**: Chuyển từ 2 cột → 1 cột
- **HUD**: Có thể collapse hoặc smaller

#### **Desktop (> 1024px)**
- **Full layout**: 2-3 columns
- **Max width**: Containers có `max-w-5xl` hoặc `max-w-7xl`
- **Spacing**: Larger gaps và padding

---

## 4. KIẾN TRÚC COMPONENT

### 4.1. Component Hierarchy

```
RootLayout
├── Providers (SuiClient, Wallet, QueryClient)
│   └── Route Groups
│       ├── (public)/
│       │   ├── PublicLayout
│       │   │   ├── PublicNavbar
│       │   │   ├── PublicBackground
│       │   │   └── page.tsx (Home)
│       │   └── gameplay/page.tsx
│       │
│       ├── (auth)/
│       │   └── AuthLayout
│       │       └── auth/page.tsx
│       │
│       ├── (user)/
│       │   ├── UserLayout
│       │   │   ├── UserNavbar
│       │   │   ├── UserBackground
│       │   │   ├── user/page.tsx
│       │   │   ├── play/page.tsx
│       │   │   │   └── GameInterface
│       │   │   │       ├── GameHUD
│       │   │   │       ├── ActionLog
│       │   │   │       ├── GameActions
│       │   │   │       ├── InventoryModal
│       │   │   │       └── MirrorHallwayGame
│       │   │   └── game/page.tsx
│       │   │
│       └── (common)/
│           └── CommonLayout
│               ├── CommonNavbar
│               ├── about/page.tsx
│               ├── news/page.tsx
│               ├── help/page.tsx
│               └── privacy/page.tsx
```

### 4.2. Key Components

#### **GameInterface.tsx**
- **Role**: Container component quản lý tất cả game UI layers
- **Props**:
  - `stats`: { oil, sanity, health, stage }
  - `inventory`: GameItem[]
  - `lanternId`: string
  - `onRefresh`: () => void
  - `children`: ReactNode (game canvas)
- **State**: 
  - `isInvOpen` (boolean)
  - `lightLevel` (number, 0-100)
- **3-Layer Architecture**:
  1. **Layer 0** (z-0): Isometric game canvas (children)
  2. **Layer 1** (z-30): HUD Overlay
     - GameHUD (top-left)
     - LightSlider (center-bottom)
     - ActionConsole (bottom-right)
     - ActionLog (above LightSlider)
     - Inventory Button (top-right)
  3. **Layer 2** (z-50): Modals
     - InventoryModal

#### **GameHUD.tsx**
- **Role**: Hiển thị player stats (HP, Oil, Sanity)
- **Data source**: `usePlayerStats()` hook hoặc props
- **Position**: Absolute, top-left
- **Style**: Dark panel với pixel borders

#### **DungeonGameHUD.tsx**
- **Role**: Alternative HUD với hearts và mini-map
- **Features**: 
  - Hearts thay vì health bar
  - Oil với water effect
  - Mini-map grid
  - Compass

#### **InventoryModal.tsx**
- **Role**: Modal hiển thị và quản lý items với rarity system
- **Grid**: 5x4 (20 slots)
- **Features**: 
  - **Rarity System**: Common, Rare, Epic, Legendary, Cursed
  - Rarity-colored borders, backgrounds, và glows
  - Rarity indicator dot trên mỗi slot
  - Tooltip hiển thị rarity khi hover
  - Item selection với rarity highlight
  - Detail panel với rarity badge
  - Use/Drop actions
  - Currency display

#### **ActionLog.tsx**
- **Role**: Hiển thị game events và messages
- **System**: Event-based (`addGameLog` function)
- **Features**:
  - Auto-scroll
  - Fade effect
  - HTML support
  - Max entries limit

#### **GameActions.tsx**
- **Role**: Action buttons (Move, Reset)
- **Features**:
  - Blockchain integration
  - Gas checking
  - Log integration
  - Particle effects

#### **LightSlider.tsx**
- **Role**: Điều chỉnh độ sáng đèn lồng (cơ chế cốt lõi)
- **Position**: Center-bottom (above ActionConsole)
- **Features**:
  - 3 modes: Stealth (0-30%), Normal (31-70%), Truth (71-100%)
  - Real-time consumption rate display
  - Visual brightness filter cho toàn màn hình
  - Mode-specific icons và colors
  - Liquid animation cho Truth mode

#### **ActionConsole.tsx**
- **Role**: RPG-style action console với log window
- **Position**: Bottom-right
- **Features**:
  - Action buttons grid (Move, Rest, Search, Attack)
  - Special actions (Focus Light, Whisper)
  - Integrated log window (terminal-style)
  - Disabled states với visual feedback
  - Auto-scroll log

#### **MirrorHallwayGame.tsx**
- **Role**: Isometric game canvas với PixiJS
- **Features**:
  - Isometric tile system
  - Player sprite
  - Dialog system
  - Choice system

#### **GameBackground.tsx**
- **Role**: Animated background với PixiJS
- **Features**:
  - Particles (amber, purple, red, gray)
  - Fog layers
  - Intensity levels (low/medium/high)

### 4.3. Hooks

#### **usePlayerStats()**
- **Source**: `hook/usePlayerStats.ts`
- **Returns**:
  - `account`: Current wallet account
  - `hasLantern`: Boolean
  - `lanternObjects`: Array of Lantern NFTs
  - `hp`, `oil`, `sanity`: Numbers
  - `isAlive`: Boolean
  - `MAX_OIL`, `MAX_SANITY`: Constants
  - `refetch`: Function

#### **useWalletBalance()**
- **Source**: `hook/useWalletBalance.ts`
- **Returns**:
  - `balance`: SUI balance (number)
  - `displayBalance`: Formatted string
  - `isLoading`, `isError`: Booleans

#### **useHasGas()**
- **Source**: `hook/useHasGas.ts`
- **Returns**: `hasGas`: Boolean (có SUI để trả gas)

#### **useMintLantern()**
- **Source**: `hook/useMintLantern.ts`
- **Returns**: `handleMint`: Function với callbacks

### 4.4. State Management

#### **Game State**
- **Local state**: React `useState` trong components
- **Global state**: 
  - Player stats: Từ blockchain (Sui objects)
  - Wallet: Từ `@mysten/dapp-kit`
  - Query cache: `@tanstack/react-query`

#### **Game Results**
- Stored trong component state (`gameResults`)
- Structure:
  ```typescript
  {
    hp?: number;
    oil?: number;
    sanity?: number;
    item?: string;
    code?: string;
  }
  ```

---

## 5. ANIMATIONS & EFFECTS

### 5.1. CSS Animations

#### **fadeIn**
- **Duration**: 0.3s
- **Easing**: `ease-in`
- **Use**: Log entries, modals

#### **fadeInUp**
- **Duration**: 1.2s
- **Easing**: `ease-out`
- **Use**: Page transitions

#### **pulse**
- **Built-in Tailwind**: `animate-pulse`
- **Use**: Low oil warning, low sanity glitch

#### **glitch**
- **Duration**: 0.3s
- **Easing**: Infinite
- **Effect**: Random translate offsets (-2px to 2px)
- **Use**: Low sanity visual feedback

#### **shake**
- **Duration**: 0.5s
- **Easing**: Infinite
- **Effect**: Horizontal shake (-2px to 2px)
- **Use**: Unstable states, low sanity

#### **shootingStar**
- **Duration**: 1.5s
- **Use**: Background particles

#### **fireFlicker**
- **Duration**: 2s
- **Easing**: `ease-in-out`
- **Use**: Fire particles

### 5.2. PixiJS Effects

#### **Particles**
- **System**: Custom particle system với Graphics
- **Properties**: position, velocity, life, color, alpha
- **Update**: Mỗi frame trong `app.ticker`

#### **Fog**
- **Layers**: 3 layers với different speeds
- **Movement**: Horizontal scroll
- **Color**: Dark purple-blue (`0x1a1a2e`)

#### **Pixel Shader**
- **Fragment shader**: Pixelation effect
- **Uniform**: `pixelSize` (20-60)
- **Use**: Backgrounds, sprites

---

## 6. RESPONSIVE BREAKPOINTS

### 6.1. Tailwind Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### 6.2. Layout Adaptations

#### **Mobile (< 768px)**
- Navbar: Hamburger menu
- Game HUD: Smaller, có thể collapse
- Action bar: Stacked vertically
- Inventory: Full screen modal
- Grid layouts: 1 column

#### **Tablet (768px - 1024px)**
- Navbar: Full menu
- Game: 2 columns (HUD + Canvas)
- Inventory: Centered modal

#### **Desktop (> 1024px)**
- Full layout với sidebars
- Game: 3 columns (HUD + Canvas + Info)
- Max widths: Containers có max-width

---

## 7. ACCESSIBILITY & UX BEST PRACTICES

### 7.1. Keyboard Navigation
- **Tab order**: Logical flow
- **Focus states**: Visible focus rings
- **Enter/Space**: Activate buttons

### 7.2. Visual Feedback
- **Hover states**: Tất cả interactive elements
- **Active states**: Press feedback
- **Disabled states**: Clear visual indication
- **Loading states**: Spinners hoặc placeholders

### 7.3. Error Handling
- **Alerts**: Browser alerts cho critical errors
- **Log system**: Non-intrusive log messages
- **Visual indicators**: Red borders, error icons

### 7.4. Performance
- **Lazy loading**: Dynamic imports cho heavy components
- **PixiJS cleanup**: Proper destroy khi unmount
- **Event cleanup**: Remove listeners khi unmount
- **Memoization**: `useMemo` cho expensive calculations

---

## 8. TECHNICAL IMPLEMENTATION NOTES

### 8.1. PixiJS Integration
- **Version**: 7.4.2
- **Rendering**: WebGL với fallback Canvas
- **Pixel mode**: `PIXI.SCALE_MODES.NEAREST`
- **Resolution**: 1 (không scale)
- **Auto density**: `true` (cho retina displays)

### 8.2. Next.js App Router
- **Structure**: Route groups `(public)`, `(user)`, `(auth)`, `(common)`
- **Layouts**: Nested layouts cho mỗi route group
- **Client components**: Tất cả game components là `"use client"`

### 8.3. State Management
- **Local**: React `useState`
- **Server state**: `@tanstack/react-query`
- **Wallet state**: `@mysten/dapp-kit`
- **Blockchain data**: Sui Client queries

### 8.4. Styling
- **Framework**: Tailwind CSS v4
- **Custom CSS**: `globals.css` cho animations và utilities
- **Pixel utilities**: `.pixel-text`, `.font-pixel`, `.pixelated`

---

## 9. VISUAL REFERENCES & INSPIRATION

### 9.1. Game References
- **Diablo 1**: Isometric perspective, dark atmosphere
- **Darkest Dungeon**: Stress/sanity mechanics, dark art style
- **Classic Roguelikes**: Turn-based, resource management

### 9.2. UI References
- **Retro Arcade Games**: Pixel fonts, chunky buttons
- **Dungeon Crawlers**: HUD layout, inventory systems
- **Web3 Games**: Wallet integration, NFT display

---

## 10. FUTURE ENHANCEMENTS

### 10.1. Planned Features
- [x] Light Slider với 3 chế độ (Stealth/Normal/Truth) ✅
- [x] Action Console với RPG-style interface ✅
- [x] GameHUD với liquid effects và glitch ✅
- [x] Inventory với rarity system ✅
- [x] 3-layer architecture ✅
- [ ] Map system với room exploration
- [ ] Combat system UI
- [ ] Character customization
- [ ] Settings menu
- [ ] Sound effects integration
- [ ] More particle effects
- [ ] Screen shake effects
- [ ] Damage numbers popup
- [ ] Light level persistence (blockchain integration)
- [ ] Oil consumption real-time calculation
- [ ] Sanity drain real-time calculation

### 10.2. UI Improvements
- [ ] Better mobile experience
- [ ] Keyboard shortcuts
- [ ] Tooltips system
- [ ] Tutorial overlay
- [ ] Achievement notifications
- [ ] Better error messages

---

## KẾT LUẬN

Giao diện ASTEROS được thiết kế với phong cách **Dark Fantasy Retro Dungeon Crawler**, kết hợp:
- **Pixel Art Aesthetic**: Font pixel, sharp edges, retro feel
- **Isometric Gameplay**: 3D perspective trong 2D space
- **Dark Atmosphere**: Tối, ma mị, Lovecraftian
- **Web3 Integration**: Seamless wallet và blockchain integration
- **Modern UX**: Smooth animations, responsive design, accessibility

Tất cả elements được thiết kế để tạo một trải nghiệm game immersive, professional, và true-to-genre.

---

**Document Version**: 2.0  
**Last Updated**: 2024  
**Author**: UI/UX Analysis from Codebase  
**Major Updates**:
- ✅ Added LightSlider component (Stealth/Normal/Truth modes)
- ✅ Added ActionConsole component (RPG-style)
- ✅ Enhanced GameHUD (liquid effects, glitch, pixel avatar)
- ✅ Added Rarity System to Inventory (Common/Rare/Epic/Legendary/Cursed)
- ✅ Implemented 3-layer architecture (Layer 0: Canvas, Layer 1: HUD, Layer 2: Modals)
- ✅ Added glitch and shake animations

