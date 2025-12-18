"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

// Kích thước tile isometric cơ bản
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export default function IsometricGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    // Khởi tạo Pixi Application
    const app = new PIXI.Application({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 0x0b0b0f,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Giữ pixel art sắc nét
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Thế giới isometric
    const isoWorld = new PIXI.Container();
    isoWorld.x = app.screen.width / 2;
    isoWorld.y = app.screen.height / 4;
    isoWorld.sortableChildren = true;
    app.stage.addChild(isoWorld);

    // Helper chuyển grid -> iso
    const toIso = (x: number, y: number) => ({
      x: (x - y) * (TILE_WIDTH / 2),
      y: (x + y) * (TILE_HEIGHT / 2),
    });

    // Vẽ demo map 10x10
    const gridSize = 10;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const tile = new PIXI.Graphics();
        const color = (x + y) % 2 === 0 ? 0x2a2f3a : 0x1c1e27;
        tile.beginFill(color);
        tile.lineStyle(1, 0x111217, 1);
        tile.moveTo(0, 0);
        tile.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, TILE_HEIGHT);
        tile.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, 0);
        tile.endFill();

        const isoPos = toIso(x, y);
        tile.x = isoPos.x;
        tile.y = isoPos.y;
        isoWorld.addChild(tile);
      }
    }

    // Nhân vật demo
    const player = new PIXI.Graphics();
    player.beginFill(0xffb94a);
    player.drawRect(-10, -30, 20, 30);
    player.endFill();
    const playerPos = toIso(5, 5);
    player.x = playerPos.x;
    player.y = playerPos.y + TILE_HEIGHT / 2;
    player.zIndex = 100;
    isoWorld.addChild(player);

    // Cleanup
    return () => {
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute top-0 left-0 -z-10"
      aria-hidden
    />
  );
}




