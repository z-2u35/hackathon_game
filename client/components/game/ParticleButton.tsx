"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

interface ParticleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  particleColor?: number;
}

export default function ParticleButton({
  children,
  onClick,
  className = "",
  disabled = false,
  particleColor = 0xffb94a,
}: ParticleButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || appRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
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
      particle.beginFill(particleColor, 0.6);
      const size = 2 + Math.random() * 3;
      particle.drawRect(0, 0, size, size);
      particle.endFill();

      particle.x = x;
      particle.y = y;

      const life = 30 + Math.random() * 20;
      particles.push({
        sprite: particle,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: life,
        maxLife: life,
      });

      app.stage.addChild(particle);
    };

    // Spawn particles on hover
    let spawnTimer = 0;
    app.ticker.add(() => {
      spawnTimer++;
      
      if (isHovered && spawnTimer % 5 === 0) {
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
        p.sprite.alpha = alpha;

        if (p.life <= 0 || p.sprite.x < 0 || p.sprite.x > app.screen.width || 
            p.sprite.y < 0 || p.sprite.y > app.screen.height) {
          app.stage.removeChild(p.sprite);
          particles.splice(index, 1);
          p.sprite.destroy();
        }
      });
    });

    return () => {
      app.ticker.stop();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [isHovered, disabled, particleColor]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}


