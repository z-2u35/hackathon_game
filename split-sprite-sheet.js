#!/usr/bin/env node

/**
 * Script cắt sprite sheet thành các frame riêng lẻ
 * Sử dụng Canvas API của Node.js (cần cài sharp hoặc canvas)
 */

const fs = require('fs');
const path = require('path');

// Kiểm tra xem có sharp không (image processing library)
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Cần cài đặt sharp: npm install sharp');
  console.log('💡 Hoặc sử dụng script Python/ImageMagick để cắt ảnh');
  process.exit(1);
}

/**
 * Cắt sprite sheet thành các frame riêng lẻ
 */
async function splitSpriteSheet(
  inputPath,
  outputDir,
  frameWidth,
  frameHeight,
  cols = 4,
  rows = 4
) {
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File không tồn tại: ${inputPath}`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📦 Đang cắt sprite sheet: ${inputPath}`);
  console.log(`📐 Kích thước frame: ${frameWidth}×${frameHeight}`);
  console.log(`📊 Grid: ${cols}×${rows} (${cols * rows} frames)\n`);

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`📏 Kích thước ảnh gốc: ${metadata.width}×${metadata.height}`);

  let frameIndex = 0;
  const frames = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * frameWidth;
      const y = row * frameHeight;

      const outputPath = path.join(outputDir, `frame_${String(frameIndex).padStart(2, '0')}.png`);

      await image
        .extract({
          left: x,
          top: y,
          width: frameWidth,
          height: frameHeight,
        })
        .toFile(outputPath);

      frames.push({
        index: frameIndex,
        row,
        col,
        x,
        y,
        path: outputPath,
      });

      frameIndex++;
    }
  }

  // Tạo metadata file
  const metaPath = path.join(outputDir, 'frames-metadata.json');
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        source: inputPath,
        frameWidth,
        frameHeight,
        cols,
        rows,
        totalFrames: frames.length,
        frames: frames.map(f => ({
          index: f.index,
          row: f.row,
          col: f.col,
          filename: path.basename(f.path),
        })),
      },
      null,
      2
    )
  );

  console.log(`\n✅ Đã cắt thành ${frames.length} frames`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📝 Metadata: ${metaPath}`);

  return frames;
}

/**
 * Tạo sprite sheet mới từ các frames (để test)
 */
async function createSpriteSheetFromFrames(framesDir, outputPath, frameWidth, frameHeight, cols) {
  const frames = fs
    .readdirSync(framesDir)
    .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
    .sort()
    .map(f => path.join(framesDir, f));

  if (frames.length === 0) {
    console.error('❌ Không tìm thấy frames trong:', framesDir);
    return;
  }

  const rows = Math.ceil(frames.length / cols);
  const totalWidth = cols * frameWidth;
  const totalHeight = rows * frameHeight;

  console.log(`🔄 Đang tạo sprite sheet: ${totalWidth}×${totalHeight}`);

  // Tạo canvas và composite các frames
  const composite = [];

  for (let i = 0; i < frames.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = col * frameWidth;
    const y = row * frameHeight;

    composite.push({
      input: frames[i],
      left: x,
      top: y,
    });
  }

  await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composite)
    .toFile(outputPath);

  console.log(`✅ Đã tạo sprite sheet: ${outputPath}`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('📖 Usage: node split-sprite-sheet.js <input-image> [frame-width] [frame-height] [cols] [rows]');
    console.log('\n📝 Example:');
    console.log('   node split-sprite-sheet.js player-sheet.png 32 32 4 4');
    console.log('\n💡 Nếu không chỉ định, sẽ tự detect từ metadata');
    process.exit(1);
  }

  const inputPath = args[0];
  const frameWidth = parseInt(args[1]) || 32;
  const frameHeight = parseInt(args[2]) || 32;
  const cols = parseInt(args[3]) || 4;
  const rows = parseInt(args[4]) || 4;

  // Output directory
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const outputDir = path.join(
    path.dirname(inputPath),
    `${inputName}_frames`
  );

  await splitSpriteSheet(inputPath, outputDir, frameWidth, frameHeight, cols, rows);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { splitSpriteSheet, createSpriteSheetFromFrames };

