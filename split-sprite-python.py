#!/usr/bin/env python3
"""
Script Python để cắt sprite sheet thành các frame riêng lẻ
Yêu cầu: pip install Pillow
"""

from PIL import Image
import sys
import os
from pathlib import Path

def split_sprite_sheet(input_path, output_dir, frame_width=32, frame_height=32, cols=4, rows=4):
    """Cắt sprite sheet thành các frame riêng lẻ"""
    
    if not os.path.exists(input_path):
        print(f"❌ File không tồn tại: {input_path}")
        return
    
    # Tạo thư mục output
    os.makedirs(output_dir, exist_ok=True)
    
    # Mở ảnh
    img = Image.open(input_path)
    print(f"📦 Đang cắt sprite sheet: {input_path}")
    print(f"📐 Kích thước ảnh gốc: {img.size[0]}×{img.size[1]}")
    print(f"📐 Kích thước frame: {frame_width}×{frame_height}")
    print(f"📊 Grid: {cols}×{rows} ({cols * rows} frames)\n")
    
    frames = []
    
    # Cắt từng frame
    for row in range(rows):
        for col in range(cols):
            x = col * frame_width
            y = row * frame_height
            
            # Extract frame
            box = (x, y, x + frame_width, y + frame_height)
            frame = img.crop(box)
            
            # Lưu frame
            frame_index = row * cols + col
            output_path = os.path.join(output_dir, f"frame_{frame_index:02d}.png")
            frame.save(output_path, "PNG")
            
            frames.append({
                "index": frame_index,
                "row": row,
                "col": col,
                "x": x,
                "y": y,
                "path": output_path
            })
            
            print(f"✅ Frame {frame_index:02d} ({row},{col}): {output_path}")
    
    # Tạo metadata
    import json
    meta_path = os.path.join(output_dir, "frames-metadata.json")
    metadata = {
        "source": input_path,
        "frameWidth": frame_width,
        "frameHeight": frame_height,
        "cols": cols,
        "rows": rows,
        "totalFrames": len(frames),
        "frames": [{
            "index": f["index"],
            "row": f["row"],
            "col": f["col"],
            "filename": os.path.basename(f["path"])
        } for f in frames]
    }
    
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Đã cắt thành {len(frames)} frames")
    print(f"📁 Output directory: {output_dir}")
    print(f"📝 Metadata: {meta_path}")
    
    return frames

def create_sprite_sheet_from_frames(frames_dir, output_path, frame_width=32, frame_height=32, cols=32):
    """Tạo sprite sheet từ các frames riêng lẻ"""
    
    # Đọc tất cả frames
    frame_files = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame_") and f.endswith(".png")])
    
    if not frame_files:
        print(f"❌ Không tìm thấy frames trong: {frames_dir}")
        return
    
    rows = (len(frame_files) + cols - 1) // cols
    total_width = cols * frame_width
    total_height = rows * frame_height
    
    print(f"🔄 Đang tạo sprite sheet: {total_width}×{total_height}")
    
    # Tạo canvas mới
    sheet = Image.new("RGBA", (total_width, total_height), (0, 0, 0, 0))
    
    # Paste các frames
    for i, frame_file in enumerate(frame_files):
        frame_path = os.path.join(frames_dir, frame_file)
        frame_img = Image.open(frame_path)
        
        row = i // cols
        col = i % cols
        x = col * frame_width
        y = row * frame_height
        
        sheet.paste(frame_img, (x, y))
        print(f"  Frame {i:02d} → ({x}, {y})")
    
    # Lưu sprite sheet
    sheet.save(output_path, "PNG")
    print(f"✅ Đã tạo sprite sheet: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("📖 Usage: python split-sprite-python.py <input-image> [frame-width] [frame-height] [cols] [rows]")
        print("\n📝 Example:")
        print("   python split-sprite-python.py player-sheet.png 32 32 4 4")
        sys.exit(1)
    
    input_path = sys.argv[1]
    frame_width = int(sys.argv[2]) if len(sys.argv) > 2 else 32
    frame_height = int(sys.argv[3]) if len(sys.argv) > 3 else 32
    cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
    rows = int(sys.argv[5]) if len(sys.argv) > 5 else 4
    
    # Output directory
    input_name = Path(input_path).stem
    output_dir = os.path.join(os.path.dirname(input_path), f"{input_name}_frames")
    
    split_sprite_sheet(input_path, output_dir, frame_width, frame_height, cols, rows)

