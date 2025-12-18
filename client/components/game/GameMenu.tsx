"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { usePlayerStats } from "@/hook/usePlayerStats";
import * as PIXI from "pixi.js";

interface GameMenuProps {
  onStartGame: () => void;
}

export default function GameMenu({ onStartGame }: GameMenuProps) {
  const account = useCurrentAccount();
  const { hasLantern } = usePlayerStats();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const particlesRef = useRef<PIXI.Graphics[]>([]);

  // Hiệu ứng particles (sương mù/hạt bay lên)
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0a0a,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    canvasRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Tạo particles (sương mù/hạt bay lên) - Nhiều hơn và đẹp hơn
    const particleContainer = new PIXI.Container();
    app.stage.addChild(particleContainer);

    // Tạo nhiều particles hơn cho hiệu ứng đẹp
    for (let i = 0; i < 50; i++) {
      const particle = new PIXI.Graphics();
      const size = Math.random() * 4 + 1;
      const alpha = Math.random() * 0.4 + 0.1;
      
      // Màu sắc đa dạng hơn (xám, tím nhạt, vàng nhạt)
      const colors = [0x4a5568, 0x6b7280, 0x7c3aed, 0xfbbf24];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.beginFill(color, alpha);
      particle.drawCircle(0, 0, size);
      particle.endFill();

      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;
      particle.vx = (Math.random() - 0.5) * 0.8;
      particle.vy = -Math.random() * 0.5 - 0.2; // Bay lên nhanh hơn

      particleContainer.addChild(particle);
      particlesRef.current.push(particle);
    }

    // Animation loop
    const ticker = PIXI.Ticker.shared;
    ticker.add(() => {
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y < -10) {
          particle.y = app.screen.height + 10;
          particle.x = Math.random() * app.screen.width;
        }
        if (particle.x < -10) particle.x = app.screen.width + 10;
        if (particle.x > app.screen.width + 10) particle.x = -10;
      });
    });

    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ticker.remove(() => {});
      app.destroy(true);
    };
  }, []);

  // Track cursor để hiển thị cursor_hand.png
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* PixiJS Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Background Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/ui/bg_menu_pattern.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Title - ASTEROS với hiệu ứng Glitch và Glow */}
        <div className="mb-12 relative">
          <h1
            className="font-pixel text-7xl md:text-9xl text-amber-400 relative z-10"
            style={{
              textShadow: `
                0 0 10px rgba(251, 191, 36, 0.9),
                0 0 20px rgba(251, 191, 36, 0.7),
                0 0 30px rgba(251, 191, 36, 0.5),
                0 0 40px rgba(251, 191, 36, 0.3),
                2px 2px 0px rgba(0, 0, 0, 0.9),
                -2px -2px 0px rgba(0, 0, 0, 0.9)
              `,
              filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}
          >
            ASTEROS
          </h1>
          {/* Glitch effect overlay - Multiple layers for better effect */}
          <div
            className="absolute inset-0 font-pixel text-7xl md:text-9xl text-purple-500 opacity-20 pointer-events-none"
            style={{
              animation: "glitch 0.3s infinite",
              clipPath: "inset(0 0 0 0)",
            }}
          >
            ASTEROS
          </div>
          <div
            className="absolute inset-0 font-pixel text-7xl md:text-9xl text-cyan-500 opacity-15 pointer-events-none"
            style={{
              animation: "glitch 0.5s infinite reverse",
              clipPath: "inset(0 0 0 0)",
            }}
          >
            ASTEROS
          </div>
        </div>

        {/* Menu Box */}
        <div className="bg-zinc-900/90 border-4 border-amber-600/50 rounded-lg p-8 max-w-md w-full shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-6 items-center">
            {!account ? (
              <>
                <p className="text-zinc-300 font-pixel text-lg text-center mb-4">
                  Kết nối ví để bắt đầu hành trình
                </p>
                <div className="relative group">
                  <ConnectButton
                    connectText="CONNECT WALLET"
                    className="cursor-pointer font-pixel text-lg px-8 py-4 bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 rounded transition-all shadow-lg hover:shadow-amber-500/50"
                  />
                  {/* Cursor hand icon khi hover */}
                  <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <img
                      src="/assets/ui/cursor_hand.png"
                      alt="cursor"
                      className="w-6 h-6"
                      onError={(e) => {
                        // Fallback nếu không có asset
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </>
            ) : !hasLantern ? (
              <>
                <p className="text-zinc-300 font-pixel text-lg text-center mb-4">
                  Bạn chưa có nhân vật. Hãy mint một Lantern để bắt đầu.
                </p>
                <button
                  onClick={() => (window.location.href = "/user")}
                  className="font-pixel text-lg px-8 py-4 bg-purple-700 hover:bg-purple-600 border-2 border-purple-900 rounded transition-all shadow-lg"
                >
                  MINT LANTERN
                </button>
              </>
            ) : (
              <>
                <p className="text-zinc-300 font-pixel text-lg text-center mb-4">
                  Sẵn sàng bắt đầu hành trình?
                </p>
                <button
                  onClick={onStartGame}
                  className="relative group font-pixel text-lg px-8 py-4 bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 rounded transition-all shadow-lg hover:shadow-amber-500/50"
                >
                  START JOURNEY
                  {/* Cursor hand icon khi hover */}
                  <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <img
                      src="/assets/ui/cursor_hand.png"
                      alt="cursor"
                      className="w-6 h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-zinc-600 font-pixel text-sm text-center">
          Dark Fantasy Dungeon Crawler • GBA Style
        </p>
      </div>

      {/* Custom CSS cho glitch và glow effects */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(251, 191, 36, 1));
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}

