#!/usr/bin/env node

/**
 * Script tổ chức lại player sprites từ 16 frames
 * Dựa trên mô tả: Row 1 (idle right), Row 2 (back), Row 3-4 (walk right)
 * Tổ chức theo format GBA: [Idle Down] [Idle Up] [Idle Left] [Idle Right] [Walk Down] [Walk Up] [Walk Left] [Walk Right]
 */

const fs = require('fs');
const path = require('path');

/**
 * Tổ chức lại frames theo format GBA Pokémon
 * Input: 16 frames từ sprite sheet 4x4
 * Output: Tổ chức theo thư mục và đặt tên theo format
 */
function organizePlayerSprites(framesDir, outputDir) {
  if (!fs.existsSync(framesDir)) {
    console.error(`❌ Thư mục không tồn tại: ${framesDir}`);
    return;
  }

  // Đọc metadata nếu có
  const metaPath = path.join(framesDir, 'frames-metadata.json');
  let frames = [];

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    frames = meta.frames.map(f => ({
      ...f,
      path: path.join(framesDir, f.filename),
    }));
  } else {
    // Nếu không có metadata, đọc trực tiếp từ thư mục
    const files = fs
      .readdirSync(framesDir)
      .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
      .sort()
      .map((f, i) => ({
        index: i,
        row: Math.floor(i / 4),
        col: i % 4,
        filename: f,
        path: path.join(framesDir, f),
      }));
    frames = files;
  }

  if (frames.length !== 16) {
    console.error(`❌ Cần đúng 16 frames, tìm thấy: ${frames.length}`);
    return;
  }

  console.log('🎮 Tổ chức lại player sprites theo format GBA Pokémon...\n');

  // Mapping từ sprite sheet 4x4 sang GBA format
  // Row 1 (0-3): Idle Right/Front-Right → Idle Right
  // Row 2 (4-7): Back views → Idle Up (hoặc Back)
  // Row 3 (8-11): Walk Right → Walk Right
  // Row 4 (12-15): Walk Right (tiếp) → Walk Right (frames 4-7)

  const gbaMapping = {
    // Idle animations (4 frames mỗi direction)
    idleDown: [frames[2], frames[2], frames[2], frames[2]], // Tạm dùng back view
    idleUp: [frames[4], frames[5], frames[6], frames[7]], // Back views
    idleLeft: [frames[0], frames[0], frames[0], frames[0]], // Flip right
    idleRight: [frames[0], frames[1], frames[2], frames[3]], // Row 1

    // Walk animations (4 frames mỗi direction)
    walkDown: [frames[6], frames[6], frames[6], frames[6]], // Tạm dùng back
    walkUp: [frames[4], frames[5], frames[6], frames[7]], // Back views
    walkLeft: [frames[8], frames[8], frames[8], frames[8]], // Flip right
    walkRight: [
      ...frames.slice(8, 12), // Row 3
      ...frames.slice(12, 16), // Row 4 (8 frames total, lấy 4 đầu)
    ].slice(0, 4),
  };

  // Tạo thư mục output
  const playerDir = path.join(outputDir, 'characters', 'player');
  fs.mkdirSync(playerDir, { recursive: true });

  // Copy và đổi tên frames theo GBA format
  const gbaFrames = [];

  // Idle Down (4 frames)
  gbaMapping.idleDown.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_idle_down_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_idle_down_${i}.png`, type: 'idle', direction: 'down', frame: i });
  });

  // Idle Up (4 frames)
  gbaMapping.idleUp.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_idle_up_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_idle_up_${i}.png`, type: 'idle', direction: 'up', frame: i });
  });

  // Idle Left (4 frames) - tạm dùng right frames
  gbaMapping.idleLeft.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_idle_left_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_idle_left_${i}.png`, type: 'idle', direction: 'left', frame: i });
  });

  // Idle Right (4 frames)
  gbaMapping.idleRight.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_idle_right_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_idle_right_${i}.png`, type: 'idle', direction: 'right', frame: i });
  });

  // Walk Down (4 frames)
  gbaMapping.walkDown.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_walk_down_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_walk_down_${i}.png`, type: 'walk', direction: 'down', frame: i });
  });

  // Walk Up (4 frames)
  gbaMapping.walkUp.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_walk_up_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_walk_up_${i}.png`, type: 'walk', direction: 'up', frame: i });
  });

  // Walk Left (4 frames) - tạm dùng right frames
  gbaMapping.walkLeft.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_walk_left_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_walk_left_${i}.png`, type: 'walk', direction: 'left', frame: i });
  });

  // Walk Right (4 frames)
  gbaMapping.walkRight.forEach((frame, i) => {
    const dest = path.join(playerDir, `spr_seeker_walk_right_${i}.png`);
    fs.copyFileSync(frame.path, dest);
    gbaFrames.push({ name: `spr_seeker_walk_right_${i}.png`, type: 'walk', direction: 'right', frame: i });
  });

  // Tạo sprite sheet mới từ các frames đã tổ chức
  const sheetPath = path.join(playerDir, 'spr_seeker_sheet.png');
  createGBAFormatSheet(playerDir, sheetPath, 32, 32);

  // Tạo metadata
  const sheetMeta = {
    frameCount: 32,
    frameWidth: 32,
    frameHeight: 32,
    rows: 1,
    cols: 32,
    totalWidth: 1024,
    totalHeight: 32,
    style: 'GBA Pokémon Gen 3',
    layout: [
      'Frames 0-3: Idle Down',
      'Frames 4-7: Idle Up',
      'Frames 8-11: Idle Left',
      'Frames 12-15: Idle Right',
      'Frames 16-19: Walk Down',
      'Frames 20-23: Walk Up',
      'Frames 24-27: Walk Left',
      'Frames 28-31: Walk Right',
    ],
    frames: gbaFrames,
  };

  fs.writeFileSync(
    path.join(playerDir, 'spr_seeker_sheet.sheet.json'),
    JSON.stringify(sheetMeta, null, 2)
  );

  console.log(`✅ Đã tổ chức ${gbaFrames.length} frames`);
  console.log(`📁 Output: ${playerDir}`);
  console.log(`📝 Sprite sheet: ${sheetPath}`);
}

/**
 * Tạo sprite sheet theo format GBA từ các frames riêng lẻ
 */
async function createGBAFormatSheet(framesDir, outputPath, frameWidth, frameHeight) {
  const sharp = require('sharp');

  // Đọc các frames theo thứ tự GBA
  const frameOrder = [
    // Idle
    'spr_seeker_idle_down_0.png',
    'spr_seeker_idle_down_1.png',
    'spr_seeker_idle_down_2.png',
    'spr_seeker_idle_down_3.png',
    'spr_seeker_idle_up_0.png',
    'spr_seeker_idle_up_1.png',
    'spr_seeker_idle_up_2.png',
    'spr_seeker_idle_up_3.png',
    'spr_seeker_idle_left_0.png',
    'spr_seeker_idle_left_1.png',
    'spr_seeker_idle_left_2.png',
    'spr_seeker_idle_left_3.png',
    'spr_seeker_idle_right_0.png',
    'spr_seeker_idle_right_1.png',
    'spr_seeker_idle_right_2.png',
    'spr_seeker_idle_right_3.png',
    // Walk
    'spr_seeker_walk_down_0.png',
    'spr_seeker_walk_down_1.png',
    'spr_seeker_walk_down_2.png',
    'spr_seeker_walk_down_3.png',
    'spr_seeker_walk_up_0.png',
    'spr_seeker_walk_up_1.png',
    'spr_seeker_walk_up_2.png',
    'spr_seeker_walk_up_3.png',
    'spr_seeker_walk_left_0.png',
    'spr_seeker_walk_left_1.png',
    'spr_seeker_walk_left_2.png',
    'spr_seeker_walk_left_3.png',
    'spr_seeker_walk_right_0.png',
    'spr_seeker_walk_right_1.png',
    'spr_seeker_walk_right_2.png',
    'spr_seeker_walk_right_3.png',
  ];

  const frames = frameOrder
    .map(f => path.join(framesDir, f))
    .filter(f => fs.existsSync(f));

  if (frames.length === 0) {
    console.error('❌ Không tìm thấy frames');
    return;
  }

  const cols = frames.length;
  const totalWidth = cols * frameWidth;
  const totalHeight = frameHeight;

  const composite = frames.map((frame, i) => ({
    input: frame,
    left: i * frameWidth,
    top: 0,
  }));

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

  console.log(`✅ Đã tạo sprite sheet: ${outputPath} (${totalWidth}×${totalHeight})`);
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('📖 Usage: node organize-player-sprites.js <frames-directory> [output-directory]');
    console.log('\n📝 Example:');
    console.log('   node organize-player-sprites.js ./player_frames ./client/public/assets');
    process.exit(1);
  }

  const framesDir = args[0];
  const outputDir = args[1] || path.join(__dirname, 'client', 'public', 'assets');

  organizePlayerSprites(framesDir, outputDir);
}

module.exports = { organizePlayerSprites, createGBAFormatSheet };

