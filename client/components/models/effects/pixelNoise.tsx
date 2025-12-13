// File: ../components/models/effects/pixelNoise.ts
import * as PIXI from "pixi.js";

/**
 * Vẽ noise pixel ngẫu nhiên lên gfx
 * @param gfx PIXI.Graphics
 * @param width width low-res
 * @param height height low-res
 * @param palette mảng màu hex
 */
export function drawPixelNoise(
  gfx: PIXI.Graphics,
  width: number,
  height: number,
  palette: number[]
) {
  const density = 0.02; // tỉ lệ noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() < density) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        gfx.beginFill(color);
        gfx.drawRect(x, y, 1, 1);
        gfx.endFill();
      }
    }
  }
}
