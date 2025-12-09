/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixelFooterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      resizeTo: containerRef.current,
      backgroundAlpha: 0,
      antialias: false,
    });

    appRef.current = app;
    containerRef.current.appendChild(app.view as any);

    // Pixel filter
    const pixelFragment = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float pixelSize;

      void main(void) {
        vec2 coord = vTextureCoord;
        coord = floor(coord * pixelSize) / pixelSize;
        gl_FragColor = texture2D(uSampler, coord);
      }
    `;

    const pixelFilter = new PIXI.Filter(undefined, pixelFragment, {
      pixelSize: 40.0,
    });

    // Dungeon tiles background (dark squares)
    const tiles: PIXI.Graphics[] = [];
    const tileSize = 20;
    const cols = Math.ceil(app.renderer.width / tileSize);
    const rows = Math.ceil(app.renderer.height / tileSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const tile = new PIXI.Graphics();
        const shade = 30 + Math.random() * 50; // dark gray variations
        tile.beginFill(PIXI.utils.rgb2hex([shade/255, shade/255, shade/255]));
        tile.drawRect(0, 0, tileSize, tileSize);
        tile.endFill();

        tile.x = i * tileSize;
        tile.y = j * tileSize;

        tile.filters = [pixelFilter];

        tiles.push(tile);
        app.stage.addChild(tile);
      }
    }

    // Optional: small glowing torches
    const torches: PIXI.Graphics[] = [];
    for (let i = 0; i < 10; i++) {
      const torch = new PIXI.Graphics();
      torch.beginFill(0xffaa33);
      torch.drawCircle(0, 0, 3);
      torch.endFill();
      torch.x = Math.random() * app.renderer.width;
      torch.y = Math.random() * app.renderer.height;
      torches.push(torch);
      app.stage.addChild(torch);
    }

    // Animation: flickering torches
    app.ticker.add(() => {
      torches.forEach((t) => {
        t.alpha = 0.5 + Math.random() * 0.5; // flicker effect
      });
    });

    return () => {
      app.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
