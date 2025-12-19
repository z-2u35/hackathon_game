/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { usePlayerStats } from "@/hook/usePlayerStats";

interface GameHUDProps {
  oil?: number;
  health?: number;
  sanity?: number;
  lanternId?: string;
}

export default function GameHUD({
  oil: propOil,
  health: propHealth,
  sanity: propSanity,
  lanternId: propLanternId,
}: GameHUDProps) {
  const playerStats = usePlayerStats();
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Sử dụng props nếu có, không thì lấy từ hook
  const oil = propOil ?? playerStats.oil ?? 0;
  const health = propHealth ?? playerStats.hp ?? 100;
  const sanity = propSanity ?? playerStats.sanity ?? 0;
  const lanternId = propLanternId ?? playerStats.lanternObjects[0]?.data?.objectId ?? "";

  const MAX_OIL = playerStats.MAX_OIL ?? 100;
  const MAX_SANITY = playerStats.MAX_SANITY ?? 100;

  const oilPercentage = (oil / MAX_OIL) * 100;
  const sanityPercentage = (sanity / MAX_SANITY) * 100;
  const isOilLow = oilPercentage < 20;
  const isSanityLow = sanityPercentage < 50;

  // Glitch effect khi Sanity thấp
  useEffect(() => {
    if (isSanityLow) {
      const interval = setInterval(() => {
        setGlitchEffect((prev) => !prev);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setGlitchEffect(false);
    }
  }, [isSanityLow]);

  if (!playerStats.hasLantern && !propLanternId) return null;

  return (
    <div className=" top-20 left-4 p-2.5 bg-black/90 border-2 border-zinc-600 rounded-sm w-60 pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-40 backdrop-blur-sm">
      {/* Avatar & Info */}
      <div className="flex gap-2 mb-2.5 border-b border-zinc-700 pb-2">
        {/* Avatar Frame - Pixel Art Style */}
        <div className="w-11 h-11 bg-zinc-800 border-2 border-zinc-500 flex items-center justify-center text-lg shadow-inner relative overflow-hidden shrink-0">
          {/* Pixel art avatar placeholder - có thể thay bằng image sau */}
          <div className="w-full h-full bg-linear-to-br from-amber-600 via-amber-700 to-amber-800 flex items-center justify-center">
            <span className="text-lg">🧙‍♂️</span>
          </div>
          {/* Ancient frame effect */}
          <div className="absolute inset-0 border-2 border-amber-600/30" />
          <div className="absolute top-0 left-0 w-2 h-2 bg-amber-600/50" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-amber-600/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-amber-600/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-600/50" />
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h2 className="text-amber-500 font-pixel text-[11px] leading-tight mb-0.5">THE SEEKER</h2>
          <span className="text-[9px] text-zinc-500 font-mono truncate">
            ID: {lanternId.slice(0, 6)}...
          </span>
        </div>
      </div>

      {/* Health Bar - Heart Icon */}
      <div className="flex flex-col mb-2 w-full">
        <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 font-pixel uppercase items-center">
          <span className="flex items-center gap-1">
            <span className="text-red-500 text-[10px]">❤️</span> Sức khỏe
          </span>
          <span className="text-[9px]">{health}/100</span>
        </div>
        <div className="h-2.5 w-full bg-zinc-900 border border-zinc-600 relative p-px">
          <div
            className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)] transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, (health / 100) * 100))}%` }}
          />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20 pointer-events-none" />
        </div>
      </div>

      {/* Oil Bar - Liquid Effect (Quan trọng nhất) */}
      <div className="flex flex-col mb-2 w-full">
        <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 font-pixel uppercase items-center">
          <span className="flex items-center gap-1">
            <span className="text-amber-400 text-[10px]">🔥</span> Đèn Dầu
          </span>
          <span className={`text-[9px] ${isOilLow ? "text-red-400 animate-pulse" : ""}`}>
            {oil}/{MAX_OIL}
          </span>
        </div>
        <div
          className={`h-5 w-full bg-zinc-900 border-2 ${
            isOilLow ? "border-red-600 animate-pulse" : "border-amber-700"
          } relative shadow-[0_0_10px_rgba(245,158,11,0.3)] overflow-hidden`}
        >
          {/* Liquid fill với gradient */}
          <div
            className="h-full bg-linear-to-r from-yellow-600 via-amber-500 to-amber-400 transition-all duration-500 relative"
            style={{ width: `${Math.max(0, Math.min(100, oilPercentage))}%` }}
          >
            {/* Water/liquid effect */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent" />
            {/* Ripple effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 animate-pulse" />
          </div>
          {/* Text overlay */}
          <span className="absolute inset-0 flex items-center justify-center text-[7px] text-black font-bold font-pixel pointer-events-none">
            {isOilLow ? "⚠️ LOW" : "OIL"}
          </span>
        </div>
      </div>

      {/* Sanity Bar - Glitch Effect khi thấp */}
      <div className="flex flex-col mb-1.5 w-full">
        <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 font-pixel uppercase items-center">
          <span className="flex items-center gap-1">
            <span className="text-purple-500 text-[10px]">👁️</span> Tinh thần
          </span>
          <span
            className={`text-[9px] ${isSanityLow ? "text-purple-400 animate-pulse" : ""} ${
              glitchEffect ? "translate-x-1" : ""
            } transition-transform`}
          >
            {sanity}/{MAX_SANITY}
          </span>
        </div>
        <div className="h-2.5 w-full bg-zinc-900 border border-purple-700 relative overflow-hidden">
          <div
            className={`h-full bg-linear-to-r from-purple-600 to-purple-400 transition-all duration-500 ${
              isSanityLow ? "animate-pulse" : ""
            }`}
            style={{ width: `${Math.max(0, Math.min(100, sanityPercentage))}%` }}
          >
            {/* Glitch effect khi thấp */}
            {isSanityLow && (
              <>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                {glitchEffect && (
                  <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-1.5 pt-1.5 border-t border-zinc-700 flex justify-between items-center">
        <span className="text-[9px] text-zinc-500 font-pixel">TRẠNG THÁI</span>
        <span
          className={`text-[9px] font-bold font-pixel ${
            playerStats.isAlive ? "text-green-400" : "text-red-400"
          }`}
        >
          {playerStats.isAlive ? "CÒN SỐNG" : "ĐÃ CHẾT"}
        </span>
      </div>
    </div>
  );
}
