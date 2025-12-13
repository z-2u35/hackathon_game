// File: ../components/models/effects/pixelGlow.ts
import * as PIXI from "pixi.js";

/**
 * Vẽ glow nhấp nháy lên gfx
 * @param gfx PIXI.Graphics
 * @param width width low-res
 * @param height height low-res
 * @param t thời gian tick
 * @param baseColor màu nền
 * @param glowColor màu glow
 */
export function drawPixelGlow(
  gfx: PIXI.Graphics,
  width: number,
  height: number,
  t: number,
  baseColor: number,
  glowColor: number
) {
  const glowDensity = 0.01; // tỉ lệ glow
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() < glowDensity) {
        const alpha = 0.5 + 0.5 * Math.sin(t + x + y);
        const color = alpha > 0.5 ? glowColor : baseColor;
        gfx.beginFill(color);
        gfx.drawRect(x, y, 1, 1);
        gfx.endFill();
      }
    }
  }
}
