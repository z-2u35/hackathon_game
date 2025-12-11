"use client";

import { RefObject, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { nearestPaletteColor, paletteHex } from "../utils/palette";
import { drawPixelNoise } from "../components/models/effects/pixelNoise";
import { drawPixelGlow } from "../components/models/effects/pixelGlow";

type Options = {
  pixelSize: number;
};

export function usePixiLowResBackground(
  ref: RefObject<HTMLDivElement>,
  options: Options
) {
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    let destroyed = false;

    async function setup() {
      const app = new PIXI.Application();

      await app.init({
        resizeTo: el,
        backgroundAlpha: 0,
        antialias: false,
        powerPreference: "high-performance",
      });

      if (destroyed) return;

      appRef.current = app;
      el.appendChild(app.canvas);

      // low-res resolution
      const lowResW = Math.max(64, Math.floor(app.screen.width / options.pixelSize));
      const lowResH = Math.max(48, Math.floor(app.screen.height / options.pixelSize));

      const renderTexture = PIXI.RenderTexture.create({
        width: lowResW,
        height: lowResH,
      });

      const gfx = new PIXI.Graphics();

      let t = 0;

      app.ticker.add(() => {
        t += 0.016;

        gfx.clear();

        // gradient
        const top = nearestPaletteColor(0x0f141b);
        const mid = nearestPaletteColor(0x1a1f2b);
        const glow = nearestPaletteColor(0xd4a94e);

        for (let y = 0; y < lowResH; y++) {
          const mix = y / lowResH;
          const base = mix < 0.6 ? top : mid;

          const amberFactor = Math.max(0, 1 - Math.abs(mix - 0.75) * 6);
          const useGlow = amberFactor > 0.02 && Math.random() < 0.02 ? glow : base;

          gfx.beginFill(useGlow);
          gfx.drawRect(0, y, lowResW, 1);
          gfx.endFill();
        }

        drawPixelNoise(gfx, lowResW, lowResH, paletteHex);
        drawPixelGlow(gfx, lowResW, lowResH, t, mid, glow);

        app.renderer.render(gfx, { renderTexture });

        const spr = new PIXI.Sprite(renderTexture);
        spr.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        spr.width = app.screen.width;
        spr.height = app.screen.height;

        app.stage.removeChildren();
        app.stage.addChild(spr);
      });
    }

    setup();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      el.querySelectorAll("canvas").forEach((c) => c.remove());
    };
  }, [ref, options.pixelSize]);
}
