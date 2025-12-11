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

    const W = app.renderer.width;
    const H = app.renderer.height;

// --------------------------------------
// DUNGEON BACKGROUND - DARKER, BETTER CONTRAST
// --------------------------------------
const dungeonBg = new PIXI.Graphics();

// Dark stone base - màu nền tối hơn
dungeonBg.beginFill(0x2a2a2a);
dungeonBg.drawRect(0, 0, W, H);
dungeonBg.endFill();

// Stone brick pattern
const brickW = 40;
const brickH = 20;
for (let y = 0; y < H; y += brickH) {
  for (let x = 0; x < W; x += brickW) {
    const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
    const brickX = x + offset;

    // Grout/mortar lines - tối hơn
    dungeonBg.beginFill(0x1a1a1a);
    dungeonBg.drawRect(brickX - 1, y - 1, brickW, brickH);
    dungeonBg.endFill();

    // Stone brick với variation rõ hơn
    const variation = Math.floor(Math.random() * 16);
    const baseColor = 0x30;
    const shade = (baseColor + variation) * 0x010101;
    dungeonBg.beginFill(shade);
    dungeonBg.drawRect(brickX, y, brickW - 2, brickH - 2);
    dungeonBg.endFill();
  }
}

// Moss/stains - rõ hơn
for (let i = 0; i < 30; i++) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  const size = 10 + Math.random() * 20;
  dungeonBg.beginFill(0x1a2e1a, 0.4); // Màu rêu xanh nhạt với alpha cao hơn
  dungeonBg.drawRect(x, y, size, size);
  dungeonBg.endFill();
}

app.stage.addChild(dungeonBg);

// Pixel shader - tăng pixelSize để rõ hơn
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
  pixelSize: 80.0, // Tăng lên để effect rõ hơn
});
    // Fire colors - orange, yellow, amber
    const fireColors = [0xff6f00, 0xff9f0f, 0xffd60a, 0xffbf00];
    const amberColors = [0xffbf69, 0xff9933, 0xcc6600];

    // --------------------------------------
    // FIRE PARTICLES (RISING EMBERS)
    // --------------------------------------
    interface Particle {
      sprite: PIXI.Graphics;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 120;

    function createParticle(x?: number, y?: number) {
      const p = new PIXI.Graphics();
      const isAmber = Math.random() < 0.3; // 30% chance amber particle
      const color = isAmber
        ? amberColors[Math.floor(Math.random() * amberColors.length)]
        : fireColors[Math.floor(Math.random() * fireColors.length)];

      const size = isAmber ? 2 + Math.random() * 3 : 3 + Math.random() * 4;

      p.beginFill(color);
      // Pixel-style squares
      p.drawRect(0, 0, size, size);
      p.endFill();

      p.x = x !== undefined ? x : Math.random() * W;
      p.y = y !== undefined ? y : H + 20;
      p.filters = [pixelFilter];

      const maxLife = 100 + Math.random() * 150;

      const particle: Particle = {
        sprite: p,
        vx: (Math.random() - 0.5) * 0.8, // slight horizontal drift
        vy: -(1 + Math.random() * 2.5), // upward motion
        life: maxLife,
        maxLife: maxLife,
        size: size,
      };

      particles.push(particle);
      app.stage.addChild(p);
    }

    // Initial particles
    for (let i = 0; i < maxParticles; i++) {
      createParticle(Math.random() * W, Math.random() * H);
    }

    // --------------------------------------
    // ANIMATION LOOP
    // --------------------------------------
    app.ticker.add(() => {
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Move particle
        p.sprite.x += p.vx;
        p.sprite.y += p.vy;

        // Add slight wobble
        p.vx += (Math.random() - 0.5) * 0.1;

        // Gravity effect (slow down as rises)
        p.vy *= 0.99;

        // Fade out
        p.life--;
        const alpha = p.life / p.maxLife;
        p.sprite.alpha = alpha;

        // Random color flicker
        if (Math.random() < 0.05) {
          const isAmber = Math.random() < 0.3;
          const newColor = isAmber
            ? amberColors[Math.floor(Math.random() * amberColors.length)]
            : fireColors[Math.floor(Math.random() * fireColors.length)];
          p.sprite.tint = newColor;
        }

        // Remove dead particles
        if (p.life <= 0 || p.sprite.y < -20) {
          app.stage.removeChild(p.sprite);
          particles.splice(i, 1);
        }
      }

      // Spawn new particles from bottom
      if (particles.length < maxParticles && Math.random() < 0.4) {
        createParticle();
      }
    });

    return () => app.destroy(true);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
}