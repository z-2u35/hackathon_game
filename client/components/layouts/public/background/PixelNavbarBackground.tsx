/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixelNavbarBackground() {
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

    // Custom pixel shader (PixiJS v7 compatible)
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
      pixelSize: 60.0,
    });

    // Create stars
    const stars: PIXI.Graphics[] = [];
    for (let i = 0; i < 40; i++) {
      const star = new PIXI.Graphics();
      star.beginFill(0xffffff);
      star.drawRect(0, 0, 3, 3);
      star.endFill();

      star.x = Math.random() * app.renderer.width;
      star.y = Math.random() * app.renderer.height;

      star.filters = [pixelFilter];

      stars.push(star);
      app.stage.addChild(star);
    }

    // Animation
    app.ticker.add(() => {
      stars.forEach((star) => {
        star.y += 0.4;
        if (star.y > app.renderer.height) {
          star.y = -5;
          star.x = Math.random() * app.renderer.width;
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
