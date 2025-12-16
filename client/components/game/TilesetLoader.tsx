"use client";

/**
 * Tileset Loader Component
 * Load và cache các tileset textures để sử dụng trong game
 */

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { ASSET_PATHS } from '@/utils/assetLoader';

export interface TilesetCache {
  floor: Map<string, PIXI.Texture>;
  walls: Map<string, PIXI.Texture>;
  props: Map<string, PIXI.Texture>;
}

/**
 * Hook để load và cache tileset textures
 */
export function useTilesetLoader() {
  const cacheRef = useRef<TilesetCache>({
    floor: new Map(),
    walls: new Map(),
    props: new Map(),
  });
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    const loadTilesets = async () => {
      try {
        // Load floor tiles
        const floorPaths = [
          ASSET_PATHS.tilesets.dungeon.floor.cracked,
          ASSET_PATHS.tilesets.dungeon.floor.bloodstained,
          ASSET_PATHS.tilesets.dungeon.floor.moss,
        ];

        for (const path of floorPaths) {
          const texture = await PIXI.Assets.load(path);
          const key = path.split('/').pop() || path;
          cacheRef.current.floor.set(key, texture);
        }

        // Load wall tiles
        const wallPaths = [
          ASSET_PATHS.tilesets.dungeon.walls.brickDark,
          ASSET_PATHS.tilesets.dungeon.walls.withWindow,
          ASSET_PATHS.tilesets.dungeon.walls.withDoorway,
        ];

        for (const path of wallPaths) {
          const texture = await PIXI.Assets.load(path);
          const key = path.split('/').pop() || path;
          cacheRef.current.walls.set(key, texture);
        }

        // Load props
        const propPaths = [
          ASSET_PATHS.tilesets.props.mirrorIntact,
          ASSET_PATHS.tilesets.props.mirrorCracked,
          ASSET_PATHS.tilesets.props.mirrorShattered,
          ASSET_PATHS.tilesets.props.crateStack,
          ASSET_PATHS.tilesets.props.barrelUpright,
          ASSET_PATHS.tilesets.props.skeleton,
        ];

        for (const path of propPaths) {
          const texture = await PIXI.Assets.load(path);
          const key = path.split('/').pop() || path;
          cacheRef.current.props.set(key, texture);
        }

        loadedRef.current = true;
        console.log('✅ Tileset textures loaded');
      } catch (error) {
        console.error('❌ Error loading tilesets:', error);
      }
    };

    loadTilesets();
  }, []);

  return cacheRef.current;
}

/**
 * Component để preload tilesets
 */
export default function TilesetLoader({ onLoad }: { onLoad?: (cache: TilesetCache) => void }) {
  const cache = useTilesetLoader();

  useEffect(() => {
    if (onLoad && cache.floor.size > 0) {
      onLoad(cache);
    }
  }, [cache, onLoad]);

  return null; // Component không render gì
}

