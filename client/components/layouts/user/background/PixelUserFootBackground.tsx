/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixelUserFootBackground() {
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
    // DUNGEON FOOT BACKGROUND - GRAYISH GREEN
    // --------------------------------------
    const dungeonBg = new PIXI.Graphics();

    // Base color: lục xám
    dungeonBg.beginFill(0x5a6658);
    dungeonBg.drawRect(0, 0, W, H);
    dungeonBg.endFill();

    // Stone brick pattern
    const brickW = 40;
    const brickH = 20;
    for (let y = 0; y < H; y += brickH) {
      for (let x = 0; x < W; x += brickW) {
        const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
        const brickX = x + offset;

        // Mortar lines (darker gray-green)
        dungeonBg.beginFill(0x3b4437);
        dungeonBg.drawRect(brickX - 1, y - 1, brickW, brickH);
        dungeonBg.endFill();

        // Stone brick with slight variation
        const variation = Math.floor(Math.random() * 16);
        const baseColor = 0x50;
        const shade = (baseColor + variation) * 0x010110;
        dungeonBg.beginFill(shade);
        dungeonBg.drawRect(brickX, y, brickW - 2, brickH - 2);
        dungeonBg.endFill();
      }
    }

    // Moss / dirt: nhiều, màu rêu lục xám nhạt
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const size = 10 + Math.random() * 25;
      dungeonBg.beginFill(0x74806b, 0.5); // rêu màu lục xám nhạt
      dungeonBg.drawRect(x, y, size, size);
      dungeonBg.endFill();
    }

    app.stage.addChild(dungeonBg);

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
      pixelSize: 30.0, // giảm để nhìn bụi rõ hơn
    });

    // Dust particle colors
    const dustColors = [0x6b705c, 0x7a846f, 0x5a6658, 0x74806b];

    interface Particle {
      sprite: PIXI.Graphics;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 150;

    function createParticle(x?: number, y?: number) {
      const p = new PIXI.Graphics();
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      const size = 2 + Math.random() * 4; // kích thước bụi
      p.beginFill(color, 0.6 + Math.random() * 0.3); // alpha cao hơn
      p.drawRect(0, 0, size, size);
      p.endFill();

      p.x = x !== undefined ? x : Math.random() * W;
      p.y = y !== undefined ? y : H + 10; // xuất hiện từ gần đáy
      p.filters = [pixelFilter];

      const maxLife = 80 + Math.random() * 100;

      const particle: Particle = {
        sprite: p,
        vx: (Math.random() - 0.5) * 0.3, // di chuyển ngang nhẹ
        vy: -(0.2 + Math.random() * 0.6), // bay lên chậm
        life: maxLife,
        maxLife: maxLife,
        size: size,
      };

      particles.push(particle);
      app.stage.addChild(p);
    }

    // Initial dust particles
    for (let i = 0; i < maxParticles; i++) {
      createParticle(Math.random() * W, Math.random() * H);
    }

    // Animation loop
    app.ticker.add(() => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.sprite.x += p.vx;
        p.sprite.y += p.vy;

        // Slight horizontal wobble
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy *= 0.995; // giảm tốc dần khi bay lên

        p.life--;
        p.sprite.alpha = p.life / p.maxLife;

        // Remove dead particles
        if (p.life <= 0 || p.sprite.y < -10) {
          app.stage.removeChild(p.sprite);
          particles.splice(i, 1);
        }
      }

      // Spawn new dust particles from bottom
      if (particles.length < maxParticles && Math.random() < 0.5) {
        createParticle();
      }
    });

    return () => app.destroy(true);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
}
