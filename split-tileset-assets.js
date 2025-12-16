#!/usr/bin/env node

/**
 * Script cắt và tổ chức tileset/sprites thành các file riêng lẻ
 * Dựa trên các sprite sheets: dungeon tiles, walls, mirrors, items, props
 */

const fs = require('fs');
const path = require('path');

// Kiểm tra sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Cần cài đặt sharp: npm install sharp');
  process.exit(1);
}

/**
 * Cắt tileset thành các tile riêng lẻ
 */
async function splitTileset(
  inputPath,
  outputDir,
  tileWidth,
  tileHeight,
  cols,
  rows,
  naming = 'tile_{index}'
) {
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File không tồn tại: ${inputPath}`);
    return [];
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📦 Đang cắt tileset: ${path.basename(inputPath)}`);
  console.log(`📐 Kích thước tile: ${tileWidth}×${tileHeight}`);
  console.log(`📊 Grid: ${cols}×${rows} (${cols * rows} tiles)\n`);

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`📏 Kích thước ảnh gốc: ${metadata.width}×${metadata.height}`);

  const tiles = [];
  let tileIndex = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileWidth;
      const y = row * tileHeight;

      const filename = naming.replace('{index}', String(tileIndex).padStart(2, '0'));
      const outputPath = path.join(outputDir, `${filename}.png`);

      await image
        .extract({
          left: x,
          top: y,
          width: tileWidth,
          height: tileHeight,
        })
        .toFile(outputPath);

      tiles.push({
        index: tileIndex,
        row,
        col,
        x,
        y,
        filename: `${filename}.png`,
        path: outputPath,
      });

      tileIndex++;
    }
  }

  // Tạo metadata
  const metaPath = path.join(outputDir, 'tiles-metadata.json');
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        source: inputPath,
        tileWidth,
        tileHeight,
        cols,
        rows,
        totalTiles: tiles.length,
        tiles: tiles.map(t => ({
          index: t.index,
          row: t.row,
          col: t.col,
          filename: t.filename,
        })),
      },
      null,
      2
    )
  );

  console.log(`✅ Đã cắt thành ${tiles.length} tiles`);
  console.log(`📁 Output: ${outputDir}`);
  console.log(`📝 Metadata: ${metaPath}\n`);

  return tiles;
}

/**
 * Tổ chức dungeon tileset (floor + walls)
 */
async function organizeDungeonTileset(tilesetPath, outputBaseDir) {
  console.log('🏰 Tổ chức Dungeon Tileset...\n');

  const tilesetsDir = path.join(outputBaseDir, 'tilesets', 'dungeon');
  fs.mkdirSync(tilesetsDir, { recursive: true });

  // Cắt floor tiles (2x2 grids, mỗi grid có 2x2 tiles)
  // Tổng: 4 grids × 4 tiles = 16 tiles, nhưng mỗi grid là 2x2 nên cần cắt theo grid
  const floorDir = path.join(tilesetsDir, 'floor');
  fs.mkdirSync(floorDir, { recursive: true });

  // Giả sử tileset có floor tiles ở bên trái
  // Cần cắt theo từng grid 2x2
  // Tạm thời cắt thành tiles riêng, sau đó có thể ghép lại
  const floorTiles = await splitTileset(
    tilesetPath,
    floorDir,
    32, // tile size (cần điều chỉnh theo thực tế)
    32,
    4, // cols trong tileset
    4, // rows trong tileset
    'tile_floor_{index}'
  );

  // Cắt wall tiles (bên phải của tileset)
  const wallDir = path.join(tilesetsDir, 'walls');
  fs.mkdirSync(wallDir, { recursive: true });

  // Tạo metadata tổng hợp
  const dungeonMeta = {
    floor: {
      tiles: floorTiles.map(t => t.filename),
      variations: {
        cracked: 'tile_floor_00.png đến tile_floor_03.png',
        bloodstained: 'tile_floor_04.png đến tile_floor_07.png',
        moss: 'tile_floor_08.png đến tile_floor_11.png',
      },
    },
    walls: {
      note: 'Wall tiles cần được cắt riêng từ phần wall của tileset',
    },
  };

  fs.writeFileSync(
    path.join(tilesetsDir, 'dungeon-tileset.json'),
    JSON.stringify(dungeonMeta, null, 2)
  );

  return { floorTiles, dungeonMeta };
}

/**
 * Tổ chức mirror sprites (3 trạng thái)
 */
async function organizeMirrorSprites(mirrorSheetPath, outputBaseDir) {
  console.log('🪞 Tổ chức Mirror Sprites...\n');

  const propsDir = path.join(outputBaseDir, 'tilesets', 'props');
  fs.mkdirSync(propsDir, { recursive: true });

  // Cắt 3 mirror states: intact, cracked, shattered
  const mirrors = await splitTileset(
    mirrorSheetPath,
    propsDir,
    32, // Cần điều chỉnh theo kích thước thực tế
    48, // Mirror có thể cao hơn
    3, // 3 states
    1, // 1 row
    'prop_mirror_{index}'
  );

  // Đổi tên theo state
  const mirrorStates = ['intact', 'cracked', 'shattered'];
  for (let i = 0; i < mirrors.length && i < mirrorStates.length; i++) {
    const oldPath = mirrors[i].path;
    const newPath = path.join(propsDir, `prop_mirror_${mirrorStates[i]}.png`);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      mirrors[i].filename = `prop_mirror_${mirrorStates[i]}.png`;
      mirrors[i].path = newPath;
    }
  }

  const mirrorMeta = {
    states: mirrorStates.map((state, i) => ({
      state,
      filename: mirrors[i]?.filename || `prop_mirror_${state}.png`,
    })),
  };

  fs.writeFileSync(
    path.join(propsDir, 'mirrors.json'),
    JSON.stringify(mirrorMeta, null, 2)
  );

  return mirrors;
}

/**
 * Tổ chức item sprites
 */
async function organizeItemSprites(itemSheetPath, outputBaseDir) {
  console.log('💎 Tổ chức Item Sprites...\n');

  const itemsDir = path.join(outputBaseDir, 'items');
  fs.mkdirSync(itemsDir, { recursive: true });

  // Cắt items (2 rows × 4 cols = 8 items)
  const items = await splitTileset(
    itemSheetPath,
    itemsDir,
    32, // Item icon size
    32,
    4, // 4 items per row
    2, // 2 rows
    'icon_item_{index}'
  );

  // Đặt tên theo item types (dựa trên mô tả)
  const itemNames = [
    'oil_flask_glowing', // Potion glowing
    'sanity_pill', // Pill bottle
    'regen_serum', // Syringe
    'memory_shard', // Blue crystal
    'oil_flask', // Potion normal
    'sanity_pill_alt', // Pill bottle duplicate
    'regen_serum_alt', // Syringe duplicate
    'memory_shard_alt', // Crystal duplicate
  ];

  const itemsMeta = [];
  for (let i = 0; i < items.length && i < itemNames.length; i++) {
    const oldPath = items[i].path;
    const itemName = itemNames[i];
    const category = itemName.includes('flask') || itemName.includes('serum') 
      ? 'consumables' 
      : itemName.includes('pill') 
      ? 'consumables'
      : 'artifacts';
    
    const categoryDir = path.join(itemsDir, category);
    fs.mkdirSync(categoryDir, { recursive: true });
    
    const newPath = path.join(categoryDir, `icon_${itemName}.png`);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      itemsMeta.push({
        name: itemName,
        category,
        filename: `icon_${itemName}.png`,
      });
    }
  }

  fs.writeFileSync(
    path.join(itemsDir, 'items.json'),
    JSON.stringify({ items: itemsMeta }, null, 2)
  );

  return itemsMeta;
}

/**
 * Tổ chức prop sprites (ruins, crates, barrels, etc.)
 */
async function organizePropSprites(propSheetPath, outputBaseDir) {
  console.log('📦 Tổ chức Prop Sprites...\n');

  const propsDir = path.join(outputBaseDir, 'tilesets', 'props');
  fs.mkdirSync(propsDir, { recursive: true });

  // Cắt props (grid lớn với nhiều variations)
  // Cần điều chỉnh theo layout thực tế của sprite sheet
  const props = await splitTileset(
    propSheetPath,
    propsDir,
    32, // Prop size
    32,
    6, // Cần điều chỉnh
    4, // Cần điều chỉnh
    'prop_{index}'
  );

  // Đặt tên theo prop types
  const propNames = [
    'ruin_pile_01', 'ruin_pile_02', 'ruin_pile_03',
    'ruin_pile_04', 'ruin_pile_05', 'ruin_pile_06',
    'ruin_pile_07', 'ruin_pile_08', 'ruin_pile_09',
    'crate_stack', 'barrel_upright', 'barrel_sideways',
    'prison_gate_closed', 'prison_gate_open', 'skeleton',
    // ... thêm các props khác
  ];

  const propsMeta = [];
  for (let i = 0; i < props.length && i < propNames.length; i++) {
    const oldPath = props[i].path;
    const propName = propNames[i];
    const newPath = path.join(propsDir, `${propName}.png`);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      propsMeta.push({
        name: propName,
        filename: `${propName}.png`,
      });
    }
  }

  fs.writeFileSync(
    path.join(propsDir, 'props.json'),
    JSON.stringify({ props: propsMeta }, null, 2)
  );

  return propsMeta;
}

/**
 * Tổ chức UI elements
 */
async function organizeUIElements(uiSheetPath, outputBaseDir) {
  console.log('🎨 Tổ chức UI Elements...\n');

  const uiDir = path.join(outputBaseDir, 'ui');
  fs.mkdirSync(uiDir, { recursive: true });

  // Cắt UI elements
  // Section 1: Large grid with golden frame
  // Section 2: Four square frames
  // Section 3: Hand cursor
  // Section 4: Arrows and star

  // Tạm thời cắt theo grid, sau đó đặt tên riêng
  const uiElements = await splitTileset(
    uiSheetPath,
    uiDir,
    64, // UI element size (cần điều chỉnh)
    64,
    4, // Cần điều chỉnh
    2, // Cần điều chỉnh
    'ui_element_{index}'
  );

  // Đặt tên theo UI types
  const uiNames = [
    'frame_inventory_grid', // Large golden grid
    'frame_slot_01', 'frame_slot_02', 'frame_slot_03', 'frame_slot_04', // Square frames
    'cursor_hand', // Hand cursor
    'icon_arrow_down', 'icon_arrow_down_alt', 'icon_star', // Arrows and star
  ];

  const uiMeta = [];
  for (let i = 0; i < uiElements.length && i < uiNames.length; i++) {
    const oldPath = uiElements[i].path;
    const uiName = uiNames[i];
    const newPath = path.join(uiDir, `${uiName}.png`);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      uiMeta.push({
        name: uiName,
        filename: `${uiName}.png`,
      });
    }
  }

  fs.writeFileSync(
    path.join(uiDir, 'ui-elements.json'),
    JSON.stringify({ elements: uiMeta }, null, 2)
  );

  return uiMeta;
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('📖 Usage: node split-tileset-assets.js <command> <input-path> [output-dir]');
    console.log('\n📝 Commands:');
    console.log('   dungeon    - Tổ chức dungeon tileset (floor + walls)');
    console.log('   mirrors    - Tổ chức mirror sprites');
    console.log('   items      - Tổ chức item sprites');
    console.log('   props      - Tổ chức prop sprites');
    console.log('   ui         - Tổ chức UI elements');
    console.log('   all        - Tổ chức tất cả (cần chỉ định các file)');
    console.log('\n📝 Example:');
    console.log('   node split-tileset-assets.js dungeon dungeon-tileset.png ./client/public/assets');
    process.exit(1);
  }

  const command = args[0];
  const inputPath = args[1];
  const outputDir = args[2] || path.join(__dirname, 'client', 'public', 'assets');

  switch (command) {
    case 'dungeon':
      await organizeDungeonTileset(inputPath, outputDir);
      break;
    case 'mirrors':
      await organizeMirrorSprites(inputPath, outputDir);
      break;
    case 'items':
      await organizeItemSprites(inputPath, outputDir);
      break;
    case 'props':
      await organizePropSprites(inputPath, outputDir);
      break;
    case 'ui':
      await organizeUIElements(inputPath, outputDir);
      break;
    default:
      console.error(`❌ Command không hợp lệ: ${command}`);
      process.exit(1);
  }

  console.log('\n✅ Hoàn thành!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  splitTileset,
  organizeDungeonTileset,
  organizeMirrorSprites,
  organizeItemSprites,
  organizePropSprites,
  organizeUIElements,
};

