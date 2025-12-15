"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

type Particle = PIXI.Graphics & {
  vx: number;
  vy: number;
  baseAlpha: number;
  phase: number;
};

export default function FantasyPixiBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new PIXI.Application({
      resizeTo: container,
      backgroundAlpha: 0,
      antialias: false,
    });

    container.appendChild(app.view as HTMLCanvasElement);

    /* ===== DARK FOG ===== */
    const fog = new PIXI.Graphics();
    fog.beginFill(0x0b0b14, 0.65);
    fog.drawRect(0, 0, app.screen.width, app.screen.height);
    fog.endFill();
    app.stage.addChild(fog);

    /* ===== GOLDEN SPARKLE EMBERS ===== */
    const particles: Particle[] = [];
    const COUNT = 90;

    for (let i = 0; i < COUNT; i++) {
      const p = new PIXI.Graphics() as Particle;

      const size = Math.random() > 0.7 ? 3 : 2;
      const color = Math.random() > 0.5 ? 0xffd166 : 0xffb703;

      p.beginFill(color, 1);
      p.drawRect(0, 0, size, size);
      p.endFill();

      p.x = Math.random() * app.screen.width;
      p.y = Math.random() * app.screen.height;

      p.vy = 0.3 + Math.random() * 0.7;
      p.vx = (Math.random() - 0.5) * 0.3;

      p.baseAlpha = 0.6 + Math.random() * 0.4;
      p.phase = Math.random() * Math.PI * 2;

      particles.push(p);
      app.stage.addChild(p);
    }

    /* ===== ANIMATE ===== */
    app.ticker.add((delta) => {
      for (const p of particles) {
        p.y -= p.vy * delta;
        p.x += p.vx * delta;

        // sparkle flicker
        p.phase += 0.08 * delta;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.35;

        // reset
        if (p.y < -10) {
          p.y = app.screen.height + 10;
          p.x = Math.random() * app.screen.width;
        }
      }
    });

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
}
