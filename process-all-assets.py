"""
Script xử lý toàn bộ assets cho Mirror Hallway Level
Tự động phát hiện và xử lý các sprite sheets từ thư mục source
"""

import os
import sys
from PIL import Image
import shutil

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'client', 'public', 'assets')

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def remove_background(img, tolerance=30):
    """Xóa nền trắng/đen"""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    data = img.getdata()
    new_data = []
    white_threshold = 240
    black_threshold = 20
    
    for item in data:
        r, g, b = item[:3]
        a = item[3] if len(item) == 4 else 255
        
        is_white = r > white_threshold and g > white_threshold and b > white_threshold
        is_black = r < black_threshold and g < black_threshold and b < black_threshold
        
        if is_white or is_black:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    
    img.putdata(new_data)
    return img

def extract_frames(source_path, output_dir, frame_w, frame_h, rows, cols, base_name, remove_bg=True, max_frames=None):
    """Cắt sprite sheet thành frames"""
    if not os.path.exists(source_path):
        return []
    
    ensure_dir(output_dir)
    img = Image.open(source_path)
    print(f"  [INFO] {os.path.basename(source_path)}: {img.width}x{img.height}")
    
    extracted = []
    frame_count = 0
    max_frames = max_frames or (rows * cols)
    
    for row in range(rows):
        for col in range(cols):
            if frame_count >= max_frames:
                break
            
            x = col * frame_w
            y = row * frame_h
            
            if x + frame_w > img.width or y + frame_h > img.height:
                continue
            
            frame = img.crop((x, y, x + frame_w, y + frame_h))
            if remove_bg:
                frame = remove_background(frame)
            
            frame_num = frame_count + 1
            output_path = os.path.join(output_dir, f"{base_name}_{frame_num:02d}.png")
            frame.save(output_path, 'PNG')
            extracted.append(output_path)
            frame_count += 1
    
    print(f"  [OK] Extracted {len(extracted)} frames")
    return extracted

def process_files_from_directory(source_dir):
    """Xử lý tất cả files trong thư mục source"""
    if not os.path.exists(source_dir):
        print(f"[ERROR] Source directory not found: {source_dir}")
        return
    
    print("[START] Processing assets from:", source_dir)
    print("=" * 60)
    
    # === FX EFFECTS ===
    fx_dir = os.path.join(ASSETS_DIR, 'fx')
    ensure_dir(fx_dir)
    print("\n[FX] Processing effects...")
    
    # Tìm và xử lý fx sheets
    for file in os.listdir(source_dir):
        if 'glitch' in file.lower() and file.endswith('.png'):
            extract_frames(
                os.path.join(source_dir, file), fx_dir,
                64, 64, 2, 5, 'fx_glitch_static', remove_bg=False, max_frames=10
            )
        elif 'glow' in file.lower() and 'amber' in file.lower() and file.endswith('.png'):
            extract_frames(
                os.path.join(source_dir, file), fx_dir,
                64, 64, 1, 9, 'fx_light_glow_amber', remove_bg=True, max_frames=9
            )
        elif 'fog' in file.lower() and file.endswith('.png'):
            extract_frames(
                os.path.join(source_dir, file), fx_dir,
                64, 64, 1, 5, 'fx_fog_war', remove_bg=True, max_frames=5
            )
    
    # === TILESETS ===
    tilesets_dir = os.path.join(ASSETS_DIR, 'tilesets')
    floor_dir = os.path.join(tilesets_dir, 'floor')
    wall_dir = os.path.join(tilesets_dir, 'wall')
    ensure_dir(floor_dir)
    ensure_dir(wall_dir)
    
    print("\n[TILESETS] Processing tiles...")
    
    # Xử lý floor và wall tiles
    for file in os.listdir(source_dir):
        file_lower = file.lower()
        file_path = os.path.join(source_dir, file)
        
        if 'floor' in file_lower and file.endswith('.png'):
            # Floor tiles - thử các layout phổ biến
            if 'moss' in file_lower or 'crack' in file_lower:
                extract_frames(file_path, floor_dir, 48, 48, 2, 2, 'tile_floor_cracked', remove_bg=True)
            else:
                extract_frames(file_path, floor_dir, 48, 48, 3, 3, 'tile_floor_clean', remove_bg=True)
        
        elif 'wall' in file_lower and file.endswith('.png'):
            # Wall tiles
            extract_frames(file_path, wall_dir, 48, 48, 2, 5, 'tile_wall_brick', remove_bg=True, max_frames=10)
    
    print("\n[DONE] Processing complete!")

if __name__ == '__main__':
    source_dir = sys.argv[1] if len(sys.argv) > 1 else 'C:/HK251/Hackathon/anh'
    process_files_from_directory(source_dir)

