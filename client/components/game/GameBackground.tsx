"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface GameBackgroundProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function GameBackground({ className = "", intensity = "medium" }: GameBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: containerRef.current.clientWidth || window.innerWidth,
      height: containerRef.current.clientHeight || window.innerHeight,
      backgroundColor: 0x0a0a0f,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Pixel art mode
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const particleCount = intensity === "low" ? 30 : intensity === "medium" ? 60 : 100;

    // Tạo particles (bụi, ánh sáng, v.v.)
    const particles: Array<{
      sprite: PIXI.Graphics;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = new PIXI.Graphics();
      
      // Random màu: vàng cam (đèn), xanh nhạt (sanity), đỏ nhạt (hp)
      const colors = [0xffb94a, 0x9d4edd, 0xef4444, 0x64748b];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.beginFill(color, 0.3 + Math.random() * 0.4);
      const size = 2 + Math.random() * 4;
      particle.drawRect(0, 0, size, size);
      particle.endFill();

      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;
      
      const life = 60 + Math.random() * 120;
      particles.push({
        sprite: particle,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: life,
        maxLife: life,
      });

      app.stage.addChild(particle);
    }

    // Fog layers (sương mù)
    const fogLayers: PIXI.Graphics[] = [];
    for (let i = 0; i < 3; i++) {
      const fog = new PIXI.Graphics();
      fog.beginFill(0x1a1a2e, 0.1 + i * 0.05);
      fog.drawRect(0, 0, app.screen.width, app.screen.height);
      fog.endFill();
      fog.x = -app.screen.width * 0.2 + i * app.screen.width * 0.1;
      fogLayers.push(fog);
      app.stage.addChild(fog);
    }

    // Animation loop
    let frame = 0;
    app.ticker.add(() => {
      frame++;

      // Update particles
      particles.forEach((p) => {
        p.sprite.x += p.vx;
        p.sprite.y += p.vy;
        p.life--;

        // Wrap around screen
        if (p.sprite.x < 0) p.sprite.x = app.screen.width;
        if (p.sprite.x > app.screen.width) p.sprite.x = 0;
        if (p.sprite.y < 0) p.sprite.y = app.screen.height;
        if (p.sprite.y > app.screen.height) p.sprite.y = 0;

        // Fade based on life
        const alpha = Math.max(0, p.life / p.maxLife);
        p.sprite.alpha = alpha * 0.5;

        // Reset life when dead
        if (p.life <= 0) {
          p.life = p.maxLife;
          p.sprite.x = Math.random() * app.screen.width;
          p.sprite.y = Math.random() * app.screen.height;
        }
      });

      // Animate fog
      fogLayers.forEach((fog, i) => {
        fog.x += 0.1 + i * 0.05;
        if (fog.x > app.screen.width) {
          fog.x = -app.screen.width * 0.5;
        }
      });
    });

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        app.renderer.resize(
          containerRef.current.clientWidth || window.innerWidth,
          containerRef.current.clientHeight || window.innerHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      app.ticker.stop();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 ${className}`}
      style={{ backgroundColor: "#0a0a0f" }}
    />
  );
}


