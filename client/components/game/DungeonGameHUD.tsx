"use client";

import { usePlayerStats } from "@/hook/usePlayerStats";
import { FaHeart, FaBrain } from "react-icons/fa";

export default function DungeonGameHUD() {
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

  if (!account || isLoading || isError || !hasLantern) return null;

  const healthPercentage = (hp / 100) * 100;
  const oilPercentage = (oil / MAX_OIL) * 100;
  const sanityPercentage = (sanity / MAX_SANITY) * 100;

  // Tính số tim hiển thị (3-5 quả tim)
  const heartCount = Math.max(1, Math.ceil((hp / 100) * 5));
  const maxHearts = 5;

  // Oil warning khi < 20%
  const isOilLow = oilPercentage < 20;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 z-30">
      {/* TOP LEFT: Avatar & Status */}
      <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto">
        {/* Avatar Frame */}
        <div className="w-16 h-16 border-4 border-zinc-700 bg-black overflow-hidden shadow-lg relative">
          {/* Placeholder avatar - có thể thay bằng image sau */}
          <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <span className="text-2xl">🕯️</span>
          </div>
          {/* Status indicator */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${isAlive ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-2 w-48 bg-zinc-900/90 border-2 border-zinc-700 p-3 shadow-lg backdrop-blur-sm">
          {/* Health - Hearts */}
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500 text-sm" />
            <span className="text-xs text-zinc-400 font-pixel">HP</span>
            <div className="flex gap-0.5 ml-auto">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < heartCount ? 'text-red-500' : 'text-zinc-700'}`}
                >
                  ❤️
                </span>
              ))}
            </div>
            <span className="text-xs text-zinc-300 font-mono ml-1">{hp}/100</span>
          </div>

          {/* Oil - Bình thủy tinh */}
          <div className="relative">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-amber-400">🛢️</span>
              <span className="text-xs text-zinc-400 font-pixel">OIL</span>
              <span className="text-xs text-zinc-300 font-mono ml-auto">{oil}/{MAX_OIL}</span>
            </div>
            <div 
              className={`h-6 bg-zinc-800 border-2 ${isOilLow ? 'border-red-600 animate-pulse' : 'border-amber-700'} relative shadow-[0_0_10px_rgba(245,158,11,0.3)] overflow-hidden`}
            >
              <div
                className="h-full bg-gradient-to-r from-yellow-600 via-amber-500 to-amber-400 transition-all duration-500 relative"
                style={{ width: `${oilPercentage}%` }}
              >
                {/* Water effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black font-bold font-pixel">
                {isOilLow ? '⚠️ LOW' : 'OIL LEVEL'}
              </span>
            </div>
          </div>

          {/* Sanity - Thanh với hiệu ứng glitch */}
          <div className="relative">
            <div className="flex items-center gap-1 mb-1">
              <FaBrain className="text-purple-500 text-sm" />
              <span className="text-xs text-zinc-400 font-pixel">SANITY</span>
              <span className="text-xs text-zinc-300 font-mono ml-auto">{sanity}/{MAX_SANITY}</span>
            </div>
            <div className="h-4 bg-zinc-800 border border-purple-700 relative overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 ${sanityPercentage < 30 ? 'animate-pulse' : ''}`}
                style={{ width: `${sanityPercentage}%` }}
              >
                {/* Glitch effect khi thấp */}
                {sanityPercentage < 30 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-zinc-700">
            <span className="text-[10px] text-zinc-500 font-pixel">STATUS</span>
            <span className={`text-[10px] font-bold font-pixel ${isAlive ? 'text-green-400' : 'text-red-400'}`}>
              {isAlive ? 'ALIVE' : 'DEAD'}
            </span>
          </div>
        </div>
      </div>

      {/* TOP RIGHT: Mini-map & Info */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="bg-zinc-900/90 border-2 border-zinc-700 p-3 shadow-lg backdrop-blur-sm min-w-[200px]">
          <div className="text-xs text-amber-400 font-pixel mb-2">📍 KHU VỰC</div>
          <div className="text-sm text-zinc-300 font-pixel mb-3">
            Tầng 1: Hầm Mộ Lãng Quên
          </div>
          
          {/* Mini-map Grid */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            {Array.from({ length: 16 }).map((_, i) => {
              const isCurrent = i === 5; // Phòng hiện tại
              const isVisited = i < 8; // Phòng đã đi qua
              return (
                <div
                  key={i}
                  className={`aspect-square border ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-400 animate-pulse'
                      : isVisited
                      ? 'bg-zinc-700 border-zinc-600'
                      : 'bg-zinc-900 border-zinc-800 opacity-50'
                  }`}
                  title={isCurrent ? 'Vị trí hiện tại' : isVisited ? 'Đã thăm' : 'Chưa khám phá'}
                >
                  {isCurrent && <span className="text-[8px]">🔥</span>}
                </div>
              );
            })}
          </div>
          
          {/* Compass */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>🧭</span>
            <span className="font-pixel">Hướng: Bắc</span>
          </div>
        </div>
      </div>
    </div>
  );
}


