"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { usePlayerStats } from "@/hook/usePlayerStats";
import { FaHeart, FaTint, FaBrain } from "react-icons/fa";

export default function AnimatedGameHUD() {
  const {
    account,
    isLoading,
    isError,
    hasLantern,
    MAX_OIL,
    MAX_SANITY,
    hp,
    oil,
    sanity,
    isAlive,
  } = usePlayerStats();

  const hudRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!hudRef.current || appRef.current || !hasLantern) return;

    const container = hudRef.current.querySelector(".hud-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const app = new PIXI.Application({
      width: rect.width,
      height: rect.height,
      backgroundAlpha: 0,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    container.appendChild(app.view as unknown as Node);
    appRef.current = app;

    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Tạo border glow effect
    const border = new PIXI.Graphics();
    border.lineStyle(2, 0xffb94a, 0.5);
    border.drawRect(0, 0, rect.width, rect.height);
    app.stage.addChild(border);

    // Particle effects ở góc
    const cornerParticles: PIXI.Graphics[] = [];
    const corners = [
      { x: 0, y: 0 },
      { x: rect.width, y: 0 },
      { x: 0, y: rect.height },
      { x: rect.width, y: rect.height },
    ];

    corners.forEach((corner) => {
      for (let i = 0; i < 3; i++) {
        const particle = new PIXI.Graphics();
        particle.beginFill(0xffb94a, 0.3);
        particle.drawRect(0, 0, 2, 2);
        particle.endFill();
        particle.x = corner.x;
        particle.y = corner.y;
        cornerParticles.push(particle);
        app.stage.addChild(particle);
      }
    });

    // Animate particles
    let frame = 0;
    app.ticker.add(() => {
      frame++;
      cornerParticles.forEach((p, i) => {
        const corner = corners[Math.floor(i / 3)];
        const angle = (frame * 0.02 + i) * Math.PI * 2;
        const radius = 5 + Math.sin(frame * 0.1 + i) * 3;
        p.x = corner.x + Math.cos(angle) * radius;
        p.y = corner.y + Math.sin(angle) * radius;
        p.alpha = 0.3 + Math.sin(frame * 0.1 + i) * 0.2;
      });
    });

    return () => {
      app.ticker.stop();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [hasLantern]);

  if (!account) return null;

  if (isLoading) {
    return (
      <div className="w-full text-center text-zinc-400 font-pixel">
        Đang kiểm tra ví...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center text-red-400 font-pixel">
        Lỗi khi đọc dữ liệu Blockchain.
      </div>
    );
  }

  if (!hasLantern) return null;

  const stats = [
    { label: "HEALTH", value: hp, max: 100, gradient: "from-red-600 to-red-400", icon: <FaHeart className="text-red-400" /> },
    { label: "OIL", value: oil, max: MAX_OIL, gradient: "from-blue-600 to-blue-400", icon: <FaTint className="text-blue-400" /> },
    { label: "SANITY", value: sanity, max: MAX_SANITY, gradient: "from-purple-600 to-purple-400", icon: <FaBrain className="text-purple-400" /> },
  ];

  return (
    <div ref={hudRef} className="w-full max-w-sm relative">
      <div className="hud-container relative bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-left font-pixel">
        <h3 className="text-xl text-amber-300 mb-3">TRẠNG THÁI NHÂN VẬT</h3>

        <div className="flex flex-col gap-3 text-sm text-zinc-200">
          {stats.map((stat) => {
            const percentage = (stat.value / stat.max) * 100;
            return (
              <div key={stat.label}>
                <div className="flex items-center gap-1 mb-1">
                  {stat.icon}
                  <span className="text-zinc-400">{stat.label}</span>
                  <span className="ml-auto font-mono">{stat.value}/{stat.max}</span>
                </div>
                <div className="w-full h-4 bg-zinc-700 rounded overflow-hidden relative">
                  <div
                    className={`h-full rounded transition-all duration-300 bg-linear-to-r ${stat.gradient}`}
                    style={{
                      width: `${percentage}%`,
                      backgroundSize: "4px 4px",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between mt-3">
            <span className="text-zinc-400">TRẠNG THÁI</span>
            <span className={`font-medium ${isAlive ? "text-green-400" : "text-red-400"}`}>
              {isAlive ? "CÒN SỐNG" : "ĐÃ CHẾT"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

