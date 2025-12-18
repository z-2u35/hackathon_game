"use client";

/**
 * Player Sprite Component - GBA Pokémon Style
 * Load và hiển thị player sprite từ sprite sheet
 */

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { loadSpriteSheetFromMeta, createAnimatedSprite, ASSET_PATHS } from '@/utils/assetLoader';

interface PlayerSpriteProps {
  direction: 'down' | 'up' | 'left' | 'right';
  animation: 'idle' | 'walk';
  x?: number;
  y?: number;
  scale?: number;
}

export default function PlayerSprite({
  direction,
  animation,
  x = 0,
  y = 0,
  scale = 1,
}: PlayerSpriteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<PIXI.AnimatedSprite | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: 64,
      height: 64,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Load sprite sheet
    loadSpriteSheetFromMeta(ASSET_PATHS.characters.player.mainSheet).then(
      ({ textures, meta }) => {
        // Calculate frame indices based on direction and animation
        // Format: [Idle Down 0-3] [Idle Up 4-7] [Idle Left 8-11] [Idle Right 12-15]
        //         [Walk Down 16-19] [Walk Up 20-23] [Walk Left 24-27] [Walk Right 28-31]
        const directionMap = { down: 0, up: 1, left: 2, right: 3 };
        const animationMap = { idle: 0, walk: 1 };
        
        const baseFrame = directionMap[direction] * 4 + animationMap[animation] * 16;
        const frames = textures.slice(baseFrame, baseFrame + 4);

        const sprite = createAnimatedSprite(frames, 0.15); // GBA animation speed
        sprite.x = x;
        sprite.y = y;
        sprite.scale.set(scale);
        sprite.anchor.set(0.5);
        sprite.play();

        app.stage.addChild(sprite);
        spriteRef.current = sprite;
      }
    );

    return () => {
      if (appRef.current) {
        app.ticker.stop();
        app.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  // Update direction/animation
  useEffect(() => {
    if (!spriteRef.current || !appRef.current) return;

    loadSpriteSheetFromMeta(ASSET_PATHS.characters.player.mainSheet).then(
      ({ textures }) => {
        const directionMap = { down: 0, up: 1, left: 2, right: 3 };
        const animationMap = { idle: 0, walk: 1 };
        
        const baseFrame = directionMap[direction] * 4 + animationMap[animation] * 16;
        const frames = textures.slice(baseFrame, baseFrame + 4);

        if (spriteRef.current) {
          spriteRef.current.textures = frames;
          spriteRef.current.play();
        }
      }
    );
  }, [direction, animation]);

  return <div ref={containerRef} className="inline-block" />;
}

