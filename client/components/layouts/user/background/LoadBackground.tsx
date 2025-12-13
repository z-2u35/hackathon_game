// components/layouts/user/background/LoadBackground.tsx
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function LoadBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Tạo particles (lantern glow)
    const particles: PIXI.Graphics[] = [];
    for (let i = 0; i < 50; i++) {
      const particle = new PIXI.Graphics();
      const color = 0xffb94a; // Màu đèn lồng
      particle.beginFill(color, 0.3 + Math.random() * 0.4);
      const size = 2 + Math.random() * 4;
      particle.drawRect(0, 0, size, size);
      particle.endFill();

      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;

      particles.push(particle);
      app.stage.addChild(particle);
    }

    // Animation
    let frame = 0;
    app.ticker.add(() => {
      frame++;
      particles.forEach((p, i) => {
        p.y += 0.3 + Math.sin(frame * 0.01 + i) * 0.2;
        p.x += Math.sin(frame * 0.02 + i) * 0.1;
        p.alpha = 0.3 + Math.sin(frame * 0.05 + i) * 0.3;

        if (p.y > app.screen.height) {
          p.y = -5;
          p.x = Math.random() * app.screen.width;
        }
        if (p.x < 0) p.x = app.screen.width;
        if (p.x > app.screen.width) p.x = 0;
      });
    });

    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      app.ticker.stop();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white font-pixel">
      {/* PixiJS Background */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-pulse text-4xl md:text-6xl drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
          ASTEROS
        </div>
        <div className="text-lg md:text-2xl text-amber-400 animate-pulse">
          Đang tải trang…
        </div>
      </div>
    </div>
  );
}
