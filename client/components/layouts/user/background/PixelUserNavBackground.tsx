/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixelUserNavBackground() {
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

    // Pixel shader
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

    // Create fire particles
    const fires: PIXI.Graphics[] = [];
    const colors = [0xff9f0f, 0xffd60a, 0xff6f00]; // amber tones

    for (let i = 0; i < 50; i++) {
      const fire = new PIXI.Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      fire.beginFill(color);
      fire.drawRect(0, 0, 4, 4);
      fire.endFill();

      fire.x = Math.random() * app.renderer.width;
      fire.y = Math.random() * app.renderer.height;

      fire.filters = [pixelFilter];

      fires.push(fire);
      app.stage.addChild(fire);
    }

    // Animation: rising flames with slight horizontal flicker
    app.ticker.add(() => {
      fires.forEach((fire) => {
        fire.y -= 0.6 + Math.random() * 0.4; // move up
        fire.x += Math.sin(fire.y * 0.05) * 0.5; // flicker side to side

        if (fire.y < -10) {
          fire.y = app.renderer.height + 10;
          fire.x = Math.random() * app.renderer.width;
        }
      });
    });

    return () => {
      app.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
