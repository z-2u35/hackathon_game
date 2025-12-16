#!/usr/bin/env node

/**
 * Script tạo cấu trúc thư mục assets cho game Retro RPG
 * Theme: Dark Fantasy Dungeon Crawler - 16-bit Pixel Art (GBA Style)
 * Naming: Snake Case (category_name_variant.png)
 */

const fs = require('fs');
const path = require('path');

// Màu sắc cho placeholder (RGBA)
const COLORS = {
  transparent: 'rgba(0,0,0,0)',
  black: 'rgba(10,10,15,255)',
  darkGray: 'rgba(45,55,72,255)',
  amber: 'rgba(255,185,74,255)',
  purple: 'rgba(157,78,221,255)',
  red: 'rgba(220,38,38,255)',
  white: 'rgba(255,255,255,255)',
};

// Base64 PNG 1x1 transparent (minimal valid PNG)
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

/**
 * Tạo file PNG placeholder đơn giản
 * Sử dụng minimal valid PNG (1x1 transparent)
 */
function createPlaceholderPNG(filePath, size = { width: 32, height: 32 }) {
  // Tạo file PNG đơn giản (1x1 transparent)
  // Trong production, có thể thay bằng canvas hoặc sharp để tạo ảnh thật
  fs.writeFileSync(filePath, TRANSPARENT_PNG);
  
  // Tạo file metadata text để biết kích thước mong muốn
  const metaPath = filePath.replace('.png', '.meta.txt');
  fs.writeFileSync(metaPath, JSON.stringify({
    width: size.width,
    height: size.height,
    type: 'placeholder',
    note: 'Replace with actual asset',
  }, null, 2));
}

/**
 * Tạo cấu trúc thư mục và files
 */
function generateAssets() {
  const baseDir = path.join(__dirname, 'client', 'public', 'assets');
  
  // Đảm bảo thư mục base tồn tại
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  console.log('🎨 Generating asset structure...\n');

  // ============================================
  // 1. UI ASSETS
  // ============================================
  console.log('📦 Creating UI assets...');
  const uiDir = path.join(baseDir, 'ui');
  fs.mkdirSync(uiDir, { recursive: true });

  const uiAssets = [
    { name: 'frame_dialogue_box.png', size: { width: 400, height: 120 } },
    { name: 'frame_inventory_slot.png', size: { width: 48, height: 48 } },
    { name: 'frame_inventory_slot_common.png', size: { width: 48, height: 48 } },
    { name: 'frame_inventory_slot_rare.png', size: { width: 48, height: 48 } },
    { name: 'frame_inventory_slot_epic.png', size: { width: 48, height: 48 } },
    { name: 'frame_inventory_slot_legendary.png', size: { width: 48, height: 48 } },
    { name: 'frame_inventory_slot_cursed.png', size: { width: 48, height: 48 } },
    { name: 'bar_health_container.png', size: { width: 200, height: 16 } },
    { name: 'bar_health_fill.png', size: { width: 200, height: 16 } },
    { name: 'bar_oil_container.png', size: { width: 200, height: 24 } },
    { name: 'bar_oil_fill.png', size: { width: 200, height: 24 } },
    { name: 'bar_sanity_container.png', size: { width: 200, height: 16 } },
    { name: 'bar_sanity_fill.png', size: { width: 200, height: 16 } },
    { name: 'cursor_hand.png', size: { width: 24, height: 24 } },
    { name: 'icon_arrow_next.png', size: { width: 16, height: 16 } },
    { name: 'bg_menu_pattern.png', size: { width: 64, height: 64 } },
  ];

  uiAssets.forEach(asset => {
    createPlaceholderPNG(path.join(uiDir, asset.name), asset.size);
  });

  // ============================================
  // 2. CHARACTER ASSETS
  // ============================================
  console.log('👤 Creating character assets...');
  const charDir = path.join(baseDir, 'characters');
  const playerDir = path.join(charDir, 'player');
  const npcsDir = path.join(charDir, 'npcs');
  const enemiesDir = path.join(charDir, 'enemies');

  fs.mkdirSync(playerDir, { recursive: true });
  fs.mkdirSync(npcsDir, { recursive: true });
  fs.mkdirSync(enemiesDir, { recursive: true });

  // Player sprites
  const directions = ['down', 'up', 'left', 'right'];
  const playerSprites = [
    ...directions.map(dir => ({ name: `spr_seeker_idle_${dir}.png`, size: { width: 32, height: 32 } })),
    ...directions.map(dir => ({ name: `spr_seeker_walk_${dir}.png`, size: { width: 32, height: 32 } })),
    { name: 'spr_seeker_action.png', size: { width: 32, height: 32 } },
  ];

  playerSprites.forEach(sprite => {
    createPlaceholderPNG(path.join(playerDir, sprite.name), sprite.size);
  });

  // NPCs
  const npcSprites = [
    { name: 'spr_merchant_whispers.png', size: { width: 32, height: 32 } },
    { name: 'spr_fallen_queen.png', size: { width: 32, height: 32 } },
  ];

  npcSprites.forEach(sprite => {
    createPlaceholderPNG(path.join(npcsDir, sprite.name), sprite.size);
  });

  // Enemies
  const enemySprites = [
    { name: 'spr_mob_phantom.png', size: { width: 32, height: 32 } },
    { name: 'spr_boss_mirror_guardian.png', size: { width: 64, height: 64 } },
  ];

  enemySprites.forEach(sprite => {
    createPlaceholderPNG(path.join(enemiesDir, sprite.name), sprite.size);
  });

  // ============================================
  // 3. ITEM ASSETS
  // ============================================
  console.log('💎 Creating item assets...');
  const itemsDir = path.join(baseDir, 'items');
  const consumablesDir = path.join(itemsDir, 'consumables');
  const weaponsDir = path.join(itemsDir, 'weapons');
  const armorDir = path.join(itemsDir, 'armor');
  const artifactsDir = path.join(itemsDir, 'artifacts');

  fs.mkdirSync(consumablesDir, { recursive: true });
  fs.mkdirSync(weaponsDir, { recursive: true });
  fs.mkdirSync(armorDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });

  // Consumables (24x24)
  const consumables = [
    'icon_oil_flask.png',
    'icon_sanity_pill.png',
    'icon_wyrm_oil.png',
    'icon_regen_serum.png',
  ];

  consumables.forEach(item => {
    createPlaceholderPNG(path.join(consumablesDir, item), { width: 24, height: 24 });
  });

  // Weapons (32x32)
  const weapons = [
    'icon_blade_scourge_legendary.png',
    'icon_chains_sun_eater_epic.png',
    'icon_dagger_ancient_epic.png',
  ];

  weapons.forEach(item => {
    createPlaceholderPNG(path.join(weaponsDir, item), { width: 32, height: 32 });
  });

  // Armor (32x32)
  const armor = [
    'icon_armor_sanguine_cursed.png',
    'icon_cloak_glitch_cursed.png',
    'icon_boots_recursion_epic.png',
  ];

  armor.forEach(item => {
    createPlaceholderPNG(path.join(armorDir, item), { width: 32, height: 32 });
  });

  // Artifacts (32x32)
  const artifacts = [
    'icon_memory_shard.png',
    'icon_lens_truth.png',
    'icon_soulbound_scar.png',
  ];

  artifacts.forEach(item => {
    createPlaceholderPNG(path.join(artifactsDir, item), { width: 32, height: 32 });
  });

  // ============================================
  // 4. TILESET ASSETS
  // ============================================
  console.log('🗺️  Creating tileset assets...');
  const tilesetsDir = path.join(baseDir, 'tilesets');
  fs.mkdirSync(tilesetsDir, { recursive: true });

  const tilesets = [
    { name: 'tile_dungeon_floor_01.png', size: { width: 64, height: 32 } }, // Isometric
    { name: 'tile_dungeon_floor_cracked.png', size: { width: 64, height: 32 } },
    { name: 'tile_wall_brick_dark.png', size: { width: 64, height: 32 } },
    { name: 'prop_lantern_post.png', size: { width: 32, height: 48 } },
    { name: 'prop_mirror_broken.png', size: { width: 32, height: 48 } },
    { name: 'prop_chest_closed.png', size: { width: 32, height: 32 } },
    { name: 'prop_chest_open.png', size: { width: 32, height: 32 } },
  ];

  tilesets.forEach(tile => {
    createPlaceholderPNG(path.join(tilesetsDir, tile.name), tile.size);
  });

  // ============================================
  // 5. FX ASSETS
  // ============================================
  console.log('✨ Creating FX assets...');
  const fxDir = path.join(baseDir, 'fx');
  fs.mkdirSync(fxDir, { recursive: true });

  const fxAssets = [
    { name: 'fx_glitch_static.png', size: { width: 64, height: 64 } },
    { name: 'fx_light_glow_amber.png', size: { width: 128, height: 128 } },
    { name: 'fx_fog_war.png', size: { width: 256, height: 256 } },
  ];

  fxAssets.forEach(fx => {
    createPlaceholderPNG(path.join(fxDir, fx.name), fx.size);
  });

  // ============================================
  // 6. TẠO FILE INDEX/LOADER HELPER
  // ============================================
  console.log('📝 Creating asset index...');
  const assetIndex = {
    ui: uiAssets.map(a => a.name),
    characters: {
      player: playerSprites.map(s => s.name),
      npcs: npcSprites.map(s => s.name),
      enemies: enemySprites.map(s => s.name),
    },
    items: {
      consumables: consumables,
      weapons: weapons,
      armor: armor,
      artifacts: artifacts,
    },
    tilesets: tilesets.map(t => t.name),
    fx: fxAssets.map(f => f.name),
  };

  const indexPath = path.join(baseDir, 'asset-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(assetIndex, null, 2));

  // Tạo TypeScript types cho asset paths
  const typesPath = path.join(__dirname, 'client', 'types', 'assets.ts');
  const typesDir = path.dirname(typesPath);
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  const typesContent = `/**
 * Auto-generated asset paths
 * Generated by generate-assets.js
 * DO NOT EDIT MANUALLY - Regenerate when assets change
 */

export const ASSET_PATHS = {
  ui: {
    frameDialogueBox: '/assets/ui/frame_dialogue_box.png',
    frameInventorySlot: '/assets/ui/frame_inventory_slot.png',
    frameInventorySlotCommon: '/assets/ui/frame_inventory_slot_common.png',
    frameInventorySlotRare: '/assets/ui/frame_inventory_slot_rare.png',
    frameInventorySlotEpic: '/assets/ui/frame_inventory_slot_epic.png',
    frameInventorySlotLegendary: '/assets/ui/frame_inventory_slot_legendary.png',
    frameInventorySlotCursed: '/assets/ui/frame_inventory_slot_cursed.png',
    barHealthContainer: '/assets/ui/bar_health_container.png',
    barHealthFill: '/assets/ui/bar_health_fill.png',
    barOilContainer: '/assets/ui/bar_oil_container.png',
    barOilFill: '/assets/ui/bar_oil_fill.png',
    barSanityContainer: '/assets/ui/bar_sanity_container.png',
    barSanityFill: '/assets/ui/bar_sanity_fill.png',
    cursorHand: '/assets/ui/cursor_hand.png',
    iconArrowNext: '/assets/ui/icon_arrow_next.png',
    bgMenuPattern: '/assets/ui/bg_menu_pattern.png',
  },
  characters: {
    player: {
      seekerIdleDown: '/assets/characters/player/spr_seeker_idle_down.png',
      seekerIdleUp: '/assets/characters/player/spr_seeker_idle_up.png',
      seekerIdleLeft: '/assets/characters/player/spr_seeker_idle_left.png',
      seekerIdleRight: '/assets/characters/player/spr_seeker_idle_right.png',
      seekerWalkDown: '/assets/characters/player/spr_seeker_walk_down.png',
      seekerWalkUp: '/assets/characters/player/spr_seeker_walk_up.png',
      seekerWalkLeft: '/assets/characters/player/spr_seeker_walk_left.png',
      seekerWalkRight: '/assets/characters/player/spr_seeker_walk_right.png',
      seekerAction: '/assets/characters/player/spr_seeker_action.png',
    },
    npcs: {
      merchantWhispers: '/assets/characters/npcs/spr_merchant_whispers.png',
      fallenQueen: '/assets/characters/npcs/spr_fallen_queen.png',
    },
    enemies: {
      mobPhantom: '/assets/characters/enemies/spr_mob_phantom.png',
      bossMirrorGuardian: '/assets/characters/enemies/spr_boss_mirror_guardian.png',
    },
  },
  items: {
    consumables: {
      oilFlask: '/assets/items/consumables/icon_oil_flask.png',
      sanityPill: '/assets/items/consumables/icon_sanity_pill.png',
      wyrmOil: '/assets/items/consumables/icon_wyrm_oil.png',
      regenSerum: '/assets/items/consumables/icon_regen_serum.png',
    },
    weapons: {
      bladeScourgeLegendary: '/assets/items/weapons/icon_blade_scourge_legendary.png',
      chainsSunEaterEpic: '/assets/items/weapons/icon_chains_sun_eater_epic.png',
      daggerAncientEpic: '/assets/items/weapons/icon_dagger_ancient_epic.png',
    },
    armor: {
      armorSanguineCursed: '/assets/items/armor/icon_armor_sanguine_cursed.png',
      cloakGlitchCursed: '/assets/items/armor/icon_cloak_glitch_cursed.png',
      bootsRecursionEpic: '/assets/items/armor/icon_boots_recursion_epic.png',
    },
    artifacts: {
      memoryShard: '/assets/items/artifacts/icon_memory_shard.png',
      lensTruth: '/assets/items/artifacts/icon_lens_truth.png',
      soulboundScar: '/assets/items/artifacts/icon_soulbound_scar.png',
    },
  },
  tilesets: {
    dungeonFloor01: '/assets/tilesets/tile_dungeon_floor_01.png',
    dungeonFloorCracked: '/assets/tilesets/tile_dungeon_floor_cracked.png',
    wallBrickDark: '/assets/tilesets/tile_wall_brick_dark.png',
    lanternPost: '/assets/tilesets/prop_lantern_post.png',
    mirrorBroken: '/assets/tilesets/prop_mirror_broken.png',
    chestClosed: '/assets/tilesets/prop_chest_closed.png',
    chestOpen: '/assets/tilesets/prop_chest_open.png',
  },
  fx: {
    glitchStatic: '/assets/fx/fx_glitch_static.png',
    lightGlowAmber: '/assets/fx/fx_light_glow_amber.png',
    fogWar: '/assets/fx/fx_fog_war.png',
  },
} as const;

export type AssetPath = typeof ASSET_PATHS[keyof typeof ASSET_PATHS][keyof typeof ASSET_PATHS[keyof typeof ASSET_PATHS]];
`;

  fs.writeFileSync(typesPath, typesContent);

  console.log('\n✅ Asset structure generated successfully!');
  console.log(`📁 Base directory: ${baseDir}`);
  console.log(`📊 Total files created: ${uiAssets.length + playerSprites.length + npcSprites.length + enemySprites.length + consumables.length + weapons.length + armor.length + artifacts.length + tilesets.length + fxAssets.length}`);
  console.log(`📝 Asset index: ${indexPath}`);
  console.log(`🔷 TypeScript types: ${typesPath}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Replace placeholder PNGs with actual pixel art assets');
  console.log('   2. Use ASSET_PATHS from types/assets.ts in your PixiJS code');
  console.log('   3. Check .meta.txt files for expected dimensions');
}

// Chạy script
if (require.main === module) {
  try {
    generateAssets();
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

module.exports = { generateAssets };

