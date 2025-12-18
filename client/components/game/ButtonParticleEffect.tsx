"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface ButtonParticleEffectProps {
  buttonId: string;
  color?: number;
  enabled?: boolean;
}

export default function ButtonParticleEffect({ 
  buttonId, 
  color = 0xffb94a,
  enabled = true 
}: ButtonParticleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current || appRef.current) return;

    const button = document.getElementById(buttonId);
    if (!button) return;

    const updateSize = () => {
      const rect = button.getBoundingClientRect();
      if (appRef.current) {
        appRef.current.renderer.resize(rect.width, rect.height);
      }
    };

    const rect = button.getBoundingClientRect();
    const app = new PIXI.Application({
      width: rect.width,
      height: rect.height,
      backgroundAlpha: 0,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const particles: Array<{
      sprite: PIXI.Graphics;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const createParticle = (x: number, y: number) => {
      const particle = new PIXI.Graphics();
      particle.beginFill(color, 0.6);
      const size = 1 + Math.random() * 2;
      particle.drawRect(0, 0, size, size);
      particle.endFill();

      particle.x = x;
      particle.y = y;

      const life = 20 + Math.random() * 15;
      particles.push({
        sprite: particle,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: life,
        maxLife: life,
      });

      app.stage.addChild(particle);
    };

    // Spawn particles on hover
    let spawnTimer = 0;
    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    app.ticker.add(() => {
      spawnTimer++;
      
      if (isHovered && spawnTimer % 3 === 0) {
        const x = Math.random() * app.screen.width;
        const y = Math.random() * app.screen.height;
        createParticle(x, y);
      }

      // Update particles
      particles.forEach((p, index) => {
        p.sprite.x += p.vx;
        p.sprite.y += p.vy;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        p.sprite.alpha = alpha * 0.5;

        if (p.life <= 0 || p.sprite.x < -5 || p.sprite.x > app.screen.width + 5 || 
            p.sprite.y < -5 || p.sprite.y > app.screen.height + 5) {
          app.stage.removeChild(p.sprite);
          particles.splice(index, 1);
          p.sprite.destroy();
        }
      });
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(button);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      app.ticker.stop();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [buttonId, color, enabled]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}


