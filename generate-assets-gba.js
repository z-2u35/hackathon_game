#!/usr/bin/env node

/**
 * Script tạo cấu trúc thư mục assets cho game Retro RPG
 * Theme: Dark Fantasy Dungeon Crawler - 16-bit Pixel Art (GBA Pokémon Style)
 * Naming: Snake Case (category_name_variant.png)
 * Structure: Sprite Sheets cho animations (như Pokémon GBA)
 */

const fs = require('fs');
const path = require('path');

// Base64 PNG 1x1 transparent (minimal valid PNG)
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

/**
 * Tạo file PNG placeholder
 */
function createPlaceholderPNG(filePath, size = { width: 32, height: 32 }) {
  fs.writeFileSync(filePath, TRANSPARENT_PNG);
  
  const metaPath = filePath.replace('.png', '.meta.txt');
  fs.writeFileSync(metaPath, JSON.stringify({
    width: size.width,
    height: size.height,
    type: 'placeholder',
    note: 'Replace with actual GBA-style pixel art asset',
    style: 'GBA Pokémon Gen 3',
  }, null, 2));
}

/**
 * Tạo sprite sheet metadata (cho animations)
 */
function createSpriteSheetMeta(filePath, frameCount, frameWidth, frameHeight, rows = 1) {
  const metaPath = filePath.replace('.png', '.sheet.json');
  fs.writeFileSync(metaPath, JSON.stringify({
    frameCount,
    frameWidth,
    frameHeight,
    rows,
    cols: Math.ceil(frameCount / rows),
    totalWidth: Math.ceil(frameCount / rows) * frameWidth,
    totalHeight: rows * frameHeight,
    style: 'GBA Pokémon Gen 3',
  }, null, 2));
}

/**
 * Tạo cấu trúc thư mục và files theo GBA Pokémon style
 */
function generateAssets() {
  const baseDir = path.join(__dirname, 'client', 'public', 'assets');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  console.log('🎮 Generating GBA Pokémon-style asset structure...\n');

  // ============================================
  // 1. UI ASSETS (GBA Pokémon Style)
  // ============================================
  console.log('📦 Creating UI assets (GBA Pokémon style)...');
  const uiDir = path.join(baseDir, 'ui');
  fs.mkdirSync(uiDir, { recursive: true });

  // Dialogue Box - 9-slice (như Pokémon)
  const dialogueBox = { name: 'frame_dialogue_box_9slice.png', size: { width: 128, height: 128 } };
  createPlaceholderPNG(path.join(uiDir, dialogueBox.name), dialogueBox.size);
  // 9-slice metadata: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right
  const nineSliceMeta = {
    sliceWidth: 16,
    sliceHeight: 16,
    borderWidth: 16,
    style: 'GBA Pokémon dialogue box',
  };
  fs.writeFileSync(
    path.join(uiDir, 'frame_dialogue_box_9slice.json'),
    JSON.stringify(nineSliceMeta, null, 2)
  );

  // Inventory slots với rarity (GBA style - pixel border)
  const raritySlots = ['common', 'rare', 'epic', 'legendary', 'cursed'];
  raritySlots.forEach(rarity => {
    createPlaceholderPNG(
      path.join(uiDir, `frame_inventory_slot_${rarity}.png`),
      { width: 40, height: 40 }
    );
  });

  // Health/Oil/Sanity bars (GBA style - pixelated)
  const bars = [
    { name: 'bar_health_container.png', size: { width: 104, height: 8 } },
    { name: 'bar_health_fill.png', size: { width: 100, height: 6 } },
    { name: 'bar_oil_container.png', size: { width: 104, height: 12 } },
    { name: 'bar_oil_fill.png', size: { width: 100, height: 10 } },
    { name: 'bar_sanity_container.png', size: { width: 104, height: 8 } },
    { name: 'bar_sanity_fill.png', size: { width: 100, height: 6 } },
  ];

  bars.forEach(bar => {
    createPlaceholderPNG(path.join(uiDir, bar.name), bar.size);
  });

  // UI Icons (GBA style)
  const uiIcons = [
    { name: 'cursor_hand.png', size: { width: 16, height: 16 } }, // Pokémon cursor
    { name: 'icon_arrow_next.png', size: { width: 8, height: 8 } }, // Blinking arrow
    { name: 'bg_menu_pattern.png', size: { width: 32, height: 32 } }, // Tile pattern
    { name: 'icon_pokeball.png', size: { width: 16, height: 16 } }, // Menu icon
  ];

  uiIcons.forEach(icon => {
    createPlaceholderPNG(path.join(uiDir, icon.name), icon.size);
  });

  // ============================================
  // 2. CHARACTER SPRITE SHEETS (GBA Pokémon Style)
  // ============================================
  console.log('👤 Creating character sprite sheets (GBA Pokémon style)...');
  const charDir = path.join(baseDir, 'characters');
  const playerDir = path.join(charDir, 'player');
  const npcsDir = path.join(charDir, 'npcs');
  const enemiesDir = path.join(charDir, 'enemies');

  fs.mkdirSync(playerDir, { recursive: true });
  fs.mkdirSync(npcsDir, { recursive: true });
  fs.mkdirSync(enemiesDir, { recursive: true });

  // Player - Sprite Sheet (như Pokémon: 4 frames per direction, 4 directions)
  // Format: Horizontal sheet với 4 frames cho mỗi hướng
  // [Idle Down 4 frames] [Idle Up 4 frames] [Idle Left 4 frames] [Idle Right 4 frames]
  // [Walk Down 4 frames] [Walk Up 4 frames] [Walk Left 4 frames] [Walk Right 4 frames]
  const playerSpriteSheet = {
    name: 'spr_seeker_sheet.png',
    frameWidth: 32,
    frameHeight: 32,
    framesPerDirection: 4,
    directions: ['down', 'up', 'left', 'right'],
    animations: ['idle', 'walk'],
  };

  // Tổng: 4 directions × 2 animations × 4 frames = 32 frames
  const totalPlayerFrames = playerSpriteSheet.directions.length * 
                           playerSpriteSheet.animations.length * 
                           playerSpriteSheet.framesPerDirection;
  const playerSheetWidth = totalPlayerFrames * playerSpriteSheet.frameWidth;
  const playerSheetHeight = playerSpriteSheet.frameHeight;

  createPlaceholderPNG(
    path.join(playerDir, playerSpriteSheet.name),
    { width: playerSheetWidth, height: playerSheetHeight }
  );
  createSpriteSheetMeta(
    path.join(playerDir, playerSpriteSheet.name),
    totalPlayerFrames,
    playerSpriteSheet.frameWidth,
    playerSpriteSheet.frameHeight,
    1
  );

  // Player Action Sheet (separate)
  createPlaceholderPNG(
    path.join(playerDir, 'spr_seeker_action_sheet.png'),
    { width: 32 * 4, height: 32 } // 4 action frames
  );
  createSpriteSheetMeta(
    path.join(playerDir, 'spr_seeker_action_sheet.png'),
    4,
    32,
    32,
    1
  );

  // NPCs - Sprite Sheets
  const npcSheets = [
    { name: 'spr_merchant_whispers_sheet.png', frames: 4, width: 32, height: 32 },
    { name: 'spr_fallen_queen_sheet.png', frames: 4, width: 32, height: 32 },
  ];

  npcSheets.forEach(npc => {
    createPlaceholderPNG(
      path.join(npcsDir, npc.name),
      { width: npc.frames * npc.width, height: npc.height }
    );
    createSpriteSheetMeta(
      path.join(npcsDir, npc.name),
      npc.frames,
      npc.width,
      npc.height,
      1
    );
  });

  // Enemies - Sprite Sheets
  const enemySheets = [
    { name: 'spr_mob_phantom_sheet.png', frames: 4, width: 32, height: 32 },
    { name: 'spr_boss_mirror_guardian_sheet.png', frames: 8, width: 64, height: 64 }, // Boss có nhiều frames hơn
  ];

  enemySheets.forEach(enemy => {
    createPlaceholderPNG(
      path.join(enemiesDir, enemy.name),
      { width: enemy.frames * enemy.width, height: enemy.height }
    );
    createSpriteSheetMeta(
      path.join(enemiesDir, enemy.name),
      enemy.frames,
      enemy.width,
      enemy.height,
      1
    );
  });

  // ============================================
  // 3. ITEM ASSETS (GBA Style Icons)
  // ============================================
  console.log('💎 Creating item assets (GBA style)...');
  const itemsDir = path.join(baseDir, 'items');
  const consumablesDir = path.join(itemsDir, 'consumables');
  const weaponsDir = path.join(itemsDir, 'weapons');
  const armorDir = path.join(itemsDir, 'armor');
  const artifactsDir = path.join(itemsDir, 'artifacts');

  fs.mkdirSync(consumablesDir, { recursive: true });
  fs.mkdirSync(weaponsDir, { recursive: true });
  fs.mkdirSync(armorDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });

  // Item Icons (GBA style - 24x24 hoặc 32x32)
  const consumables = [
    'icon_oil_flask.png',
    'icon_sanity_pill.png',
    'icon_wyrm_oil.png',
    'icon_regen_serum.png',
  ];

  consumables.forEach(item => {
    createPlaceholderPNG(path.join(consumablesDir, item), { width: 24, height: 24 });
  });

  const weapons = [
    'icon_blade_scourge_legendary.png',
    'icon_chains_sun_eater_epic.png',
    'icon_dagger_ancient_epic.png',
  ];

  weapons.forEach(item => {
    createPlaceholderPNG(path.join(weaponsDir, item), { width: 32, height: 32 });
  });

  const armor = [
    'icon_armor_sanguine_cursed.png',
    'icon_cloak_glitch_cursed.png',
    'icon_boots_recursion_epic.png',
  ];

  armor.forEach(item => {
    createPlaceholderPNG(path.join(armorDir, item), { width: 32, height: 32 });
  });

  const artifacts = [
    'icon_memory_shard.png',
    'icon_lens_truth.png',
    'icon_soulbound_scar.png',
  ];

  artifacts.forEach(item => {
    createPlaceholderPNG(path.join(artifactsDir, item), { width: 32, height: 32 });
  });

  // ============================================
  // 4. TILESET ASSETS (GBA Style - Isometric)
  // ============================================
  console.log('🗺️  Creating tileset assets (GBA style)...');
  const tilesetsDir = path.join(baseDir, 'tilesets');
  fs.mkdirSync(tilesetsDir, { recursive: true });

  // Tiles (GBA style - isometric 64x32)
  const tiles = [
    { name: 'tile_dungeon_floor_01.png', size: { width: 64, height: 32 } },
    { name: 'tile_dungeon_floor_cracked.png', size: { width: 64, height: 32 } },
    { name: 'tile_wall_brick_dark.png', size: { width: 64, height: 32 } },
  ];

  tiles.forEach(tile => {
    createPlaceholderPNG(path.join(tilesetsDir, tile.name), tile.size);
  });

  // Props (GBA style)
  const props = [
    { name: 'prop_lantern_post.png', size: { width: 32, height: 48 } },
    { name: 'prop_mirror_broken.png', size: { width: 32, height: 48 } },
    { name: 'prop_chest_closed.png', size: { width: 32, height: 32 } },
    { name: 'prop_chest_open.png', size: { width: 32, height: 32 } },
  ];

  props.forEach(prop => {
    createPlaceholderPNG(path.join(tilesetsDir, prop.name), prop.size);
  });

  // ============================================
  // 5. FX ASSETS (GBA Style Effects)
  // ============================================
  console.log('✨ Creating FX assets (GBA style)...');
  const fxDir = path.join(baseDir, 'fx');
  fs.mkdirSync(fxDir, { recursive: true });

  // FX Sprite Sheets (GBA style - animation frames)
  const fxSheets = [
    { name: 'fx_glitch_static_sheet.png', frames: 4, width: 64, height: 64 },
    { name: 'fx_light_glow_amber_sheet.png', frames: 8, width: 32, height: 32 }, // Pulsing glow
    { name: 'fx_fog_war_sheet.png', frames: 4, width: 128, height: 128 },
  ];

  fxSheets.forEach(fx => {
    createPlaceholderPNG(
      path.join(fxDir, fx.name),
      { width: fx.frames * fx.width, height: fx.height }
    );
    createSpriteSheetMeta(
      path.join(fxDir, fx.name),
      fx.frames,
      fx.width,
      fx.height,
      1
    );
  });

  // ============================================
  // 6. TẠO ASSET LOADER & HELPER UTILITIES
  // ============================================
  console.log('📝 Creating asset loader utilities...');

  // Asset Index
  const assetIndex = {
    ui: {
      dialogueBox: 'frame_dialogue_box_9slice.png',
      inventorySlots: raritySlots.map(r => `frame_inventory_slot_${r}.png`),
      bars: bars.map(b => b.name),
      icons: uiIcons.map(i => i.name),
    },
    characters: {
      player: {
        mainSheet: 'spr_seeker_sheet.png',
        actionSheet: 'spr_seeker_action_sheet.png',
      },
      npcs: npcSheets.map(n => n.name),
      enemies: enemySheets.map(e => e.name),
    },
    items: {
      consumables,
      weapons,
      armor,
      artifacts,
    },
    tilesets: {
      tiles: tiles.map(t => t.name),
      props: props.map(p => p.name),
    },
    fx: fxSheets.map(f => f.name),
  };

  const indexPath = path.join(baseDir, 'asset-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(assetIndex, null, 2));

  // TypeScript Asset Loader
  const loaderPath = path.join(__dirname, 'client', 'utils', 'assetLoader.ts');
  const loaderDir = path.dirname(loaderPath);
  if (!fs.existsSync(loaderDir)) {
    fs.mkdirSync(loaderDir, { recursive: true });
  }

  const loaderContent = `/**
 * GBA Pokémon-style Asset Loader for PixiJS
 * Auto-generated by generate-assets-gba.js
 */

import * as PIXI from 'pixi.js';

export interface SpriteSheetMeta {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  rows: number;
  cols: number;
  totalWidth: number;
  totalHeight: number;
  style: string;
}

export interface NineSliceMeta {
  sliceWidth: number;
  sliceHeight: number;
  borderWidth: number;
  style: string;
}

/**
 * Load sprite sheet và tạo animation frames
 */
export async function loadSpriteSheet(
  path: string,
  frameWidth: number,
  frameHeight: number,
  frameCount: number
): Promise<PIXI.Texture[]> {
  const texture = await PIXI.Assets.load(path);
  const frames: PIXI.Texture[] = [];

  for (let i = 0; i < frameCount; i++) {
    const x = (i % Math.ceil(frameCount / 1)) * frameWidth;
    const y = Math.floor(i / Math.ceil(frameCount / 1)) * frameHeight;
    
    frames.push(
      new PIXI.Texture(
        texture.baseTexture,
        new PIXI.Rectangle(x, y, frameWidth, frameHeight)
      )
    );
  }

  return frames;
}

/**
 * Load sprite sheet từ metadata file
 */
export async function loadSpriteSheetFromMeta(
  sheetPath: string
): Promise<{ textures: PIXI.Texture[]; meta: SpriteSheetMeta }> {
  const metaPath = sheetPath.replace('.png', '.sheet.json');
  const meta: SpriteSheetMeta = await fetch(metaPath).then(r => r.json());
  
  const textures = await loadSpriteSheet(
    sheetPath,
    meta.frameWidth,
    meta.frameHeight,
    meta.frameCount
  );

  return { textures, meta };
}

/**
 * Tạo 9-slice sprite từ texture (GBA Pokémon dialogue box style)
 */
export async function createNineSliceSprite(
  path: string
): Promise<PIXI.NineSlicePlane> {
  const texture = await PIXI.Assets.load(path);
  const metaPath = path.replace('.png', '.json');
  const meta: NineSliceMeta = await fetch(metaPath).then(r => r.json());

  return new PIXI.NineSlicePlane(
    texture,
    meta.borderWidth,
    meta.borderWidth,
    meta.borderWidth,
    meta.borderWidth
  );
}

/**
 * Tạo animated sprite từ sprite sheet
 */
export function createAnimatedSprite(
  textures: PIXI.Texture[],
  animationSpeed: number = 0.1
): PIXI.AnimatedSprite {
  const sprite = new PIXI.AnimatedSprite(textures);
  sprite.animationSpeed = animationSpeed;
  sprite.loop = true;
  return sprite;
}

/**
 * Asset paths (GBA Pokémon style)
 */
export const ASSET_PATHS = {
  ui: {
    dialogueBox: '/assets/ui/frame_dialogue_box_9slice.png',
    inventorySlot: (rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'cursed') =>
      \`/assets/ui/frame_inventory_slot_\${rarity}.png\`,
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
      mainSheet: '/assets/characters/player/spr_seeker_sheet.png',
      actionSheet: '/assets/characters/player/spr_seeker_action_sheet.png',
    },
    npcs: {
      merchantWhispers: '/assets/characters/npcs/spr_merchant_whispers_sheet.png',
      fallenQueen: '/assets/characters/npcs/spr_fallen_queen_sheet.png',
    },
    enemies: {
      mobPhantom: '/assets/characters/enemies/spr_mob_phantom_sheet.png',
      bossMirrorGuardian: '/assets/characters/enemies/spr_boss_mirror_guardian_sheet.png',
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
    glitchStatic: '/assets/fx/fx_glitch_static_sheet.png',
    lightGlowAmber: '/assets/fx/fx_light_glow_amber_sheet.png',
    fogWar: '/assets/fx/fx_fog_war_sheet.png',
  },
} as const;
`;

  fs.writeFileSync(loaderPath, loaderContent);

  // Component Helper cho GBA Pokémon UI
  const componentPath = path.join(__dirname, 'client', 'components', 'game', 'GBAStyleUI.tsx');
  const componentDir = path.dirname(componentPath);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const componentContent = `"use client";

/**
 * GBA Pokémon-style UI Components
 * Sử dụng 9-slice và pixel-perfect rendering
 */

import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { createNineSliceSprite, ASSET_PATHS } from '@/utils/assetLoader';

interface GBADialogueBoxProps {
  text: string;
  speaker?: string;
  onClose?: () => void;
  width?: number;
  height?: number;
}

/**
 * Dialogue Box theo style GBA Pokémon (9-slice)
 */
export function GBADialogueBox({
  text,
  speaker,
  onClose,
  width = 400,
  height = 120,
}: GBADialogueBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Load và tạo 9-slice dialogue box
    createNineSliceSprite(ASSET_PATHS.ui.dialogueBox).then((nineSlice) => {
      nineSlice.width = width;
      nineSlice.height = height;
      app.stage.addChild(nineSlice);
    });

    return () => {
      if (appRef.current) {
        app.ticker.stop();
        app.destroy(true);
        appRef.current = null;
      }
    };
  }, [width, height]);

  return (
    <div className="relative">
      <div ref={containerRef} className="relative" />
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center p-4">
        {speaker && (
          <div className="text-amber-400 font-pixel text-sm mb-2 uppercase w-full text-left">
            {speaker}
          </div>
        )}
        <div className="text-zinc-200 font-pixel text-base leading-relaxed w-full">
          {text}
        </div>
      </div>
    </div>
  );
}

/**
 * Health/Oil/Sanity Bar theo style GBA Pokémon
 */
interface GBABarProps {
  value: number;
  max: number;
  type: 'health' | 'oil' | 'sanity';
  width?: number;
  height?: number;
}

export function GBABar({ value, max, type, width = 104, height = 8 }: GBABarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Load container và fill textures
    const containerPath = ASSET_PATHS.ui[\`bar\${type.charAt(0).toUpperCase() + type.slice(1)}Container\` as keyof typeof ASSET_PATHS.ui];
    const fillPath = ASSET_PATHS.ui[\`bar\${type.charAt(0).toUpperCase() + type.slice(1)}Fill\` as keyof typeof ASSET_PATHS.ui];

    Promise.all([
      PIXI.Assets.load(containerPath),
      PIXI.Assets.load(fillPath),
    ]).then(([containerTex, fillTex]) => {
      const container = new PIXI.Sprite(containerTex);
      container.width = width;
      container.height = height;
      app.stage.addChild(container);

      const fill = new PIXI.Sprite(fillTex);
      const fillWidth = (value / max) * (width - 4);
      fill.width = fillWidth;
      fill.height = height - 4;
      fill.x = 2;
      fill.y = 2;
      app.stage.addChild(fill);
    });

    return () => {
      if (appRef.current) {
        app.ticker.stop();
        app.destroy(true);
        appRef.current = null;
      }
    };
  }, [value, max, type, width, height]);

  return <div ref={containerRef} className="relative" />;
}
`;

  fs.writeFileSync(componentPath, componentContent);

  console.log('\n✅ GBA Pokémon-style asset structure generated successfully!');
  console.log(`📁 Base directory: ${baseDir}`);
  console.log(`📊 Total sprite sheets: ${1 + 1 + npcSheets.length + enemySheets.length + fxSheets.length}`);
  console.log(`📝 Asset index: ${indexPath}`);
  console.log(`🔷 Asset loader: ${loaderPath}`);
  console.log(`🎨 GBA UI components: ${componentPath}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Replace placeholder PNGs with actual GBA-style pixel art');
  console.log('   2. Create sprite sheets: 4 frames per animation (GBA standard)');
  console.log('   3. Use loadSpriteSheetFromMeta() to load animations');
  console.log('   4. Use GBADialogueBox and GBABar for UI');
  console.log('   5. Check .sheet.json files for sprite sheet metadata');
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

