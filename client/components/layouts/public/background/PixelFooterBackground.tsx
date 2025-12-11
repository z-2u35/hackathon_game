/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixelFooterBackground({
  className,
}: {
  className?: string;
}) {
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

    // Pixelate filter
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
      pixelSize: 20.0,
    });

    // === 18-BIT EARTH PALETTE (3-tone) ===
    const earthPalette = [
      0x4a3a2a, // deep dark brown
      0x6d563f, // mid earth
      0x8c7256, // light earth
    ];

    const rockPalette = [0x3d2f23, 0x5a4636, 0x7b6249];

    // === EARTH LAYER (full-width noise field) ===
    const earthTiles: PIXI.Graphics[] = [];
    const tileSize = 18;
    const rows = 16; // thickness of the earth layer
    const width = () => app.renderer.width;
    const bottom = () => app.renderer.height;

    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < width() / tileSize; i++) {
        const tile = new PIXI.Graphics();
        const color =
          earthPalette[Math.floor(Math.random() * earthPalette.length)];

        const greenBlend = 0x003300; // xanh lục rất tối để blend
        const finalColor = color + greenBlend;
        tile.beginFill(finalColor);

        tile.drawRect(0, 0, tileSize, tileSize);
        tile.endFill();

        tile.x = i * tileSize;
        tile.y = bottom() - (rows - r) * tileSize;
        tile.alpha = 1;
        tile.filters = [pixelFilter];

        earthTiles.push(tile);
        app.stage.addChild(tile);
      }
    }

    // === ROCK CHUNKS (larger stone pieces) ===
    const rocks: PIXI.Graphics[] = [];
    const rockCount = 40;

    for (let i = 0; i < rockCount; i++) {
      const r = new PIXI.Graphics();
      const c = rockPalette[Math.floor(Math.random() * rockPalette.length)];

      const size = 6 + Math.random() * 5;

      r.beginFill(c);
      r.drawRect(0, 0, size, size);
      r.endFill();

      r.x = Math.random() * width();
      r.y = bottom() - 120 + Math.random() * 80;
      r.alpha = 0.85;

      r.filters = [pixelFilter];

      rocks.push(r);
      app.stage.addChild(r);
    }

    // === Dust Particles ===
    const dustParticles: PIXI.Graphics[] = [];
    const dustCount = 45;

    for (let i = 0; i < dustCount; i++) {
      const d = new PIXI.Graphics();
      d.beginFill(0xffffff);
      d.drawRect(0, 0, 2, 2);
      d.endFill();

      d.x = Math.random() * width();
      d.y = bottom() - 40 + Math.random() * 40;
      d.alpha = 0.12 + Math.random() * 0.2;
      d.filters = [pixelFilter];

      dustParticles.push(d);
      app.stage.addChild(d);
    }

    // === Animation Loop ===
    app.ticker.add(() => {
      // dust
      dustParticles.forEach((d) => {
        d.y -= 0.2 + Math.random() * 0.3;
        d.x += (Math.random() - 0.5) * 0.5;

        if (d.y < bottom() - 140) {
          d.y = bottom() - 40 + Math.random() * 40;
          d.x = Math.random() * width();
        }
      });

      // very subtle movement for rocks + earth (retro breathing effect)
      earthTiles.forEach((t) => {
        t.y += Math.sin(t.x * 0.02 + performance.now() * 0.001) * 0.05;
      });

      rocks.forEach((r) => {
        r.y += Math.sin(r.x * 0.03 + performance.now() * 0.001) * 0.08;
      });
    });

    return () => app.destroy(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${
        className ?? ""
      }`}
    />
  );
}
