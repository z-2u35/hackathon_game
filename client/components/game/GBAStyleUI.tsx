"use client";

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
    const containerPath = ASSET_PATHS.ui[`bar${type.charAt(0).toUpperCase() + type.slice(1)}Container` as keyof typeof ASSET_PATHS.ui];
    const fillPath = ASSET_PATHS.ui[`bar${type.charAt(0).toUpperCase() + type.slice(1)}Fill` as keyof typeof ASSET_PATHS.ui];

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
