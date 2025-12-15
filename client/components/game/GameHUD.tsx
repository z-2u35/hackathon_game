"use client";

import React from "react";
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
  lanternId: propLanternId 
}: GameHUDProps) {
  const playerStats = usePlayerStats();
  
  // Sử dụng props nếu có, không thì lấy từ hook
  const oil = propOil ?? playerStats.oil ?? 0;
  const health = propHealth ?? playerStats.hp ?? 100;
  const sanity = propSanity ?? playerStats.sanity ?? 0;
  const lanternId = propLanternId ?? playerStats.lanternObjects[0]?.data?.objectId ?? "";

  // Hàm tạo thanh bar pixel
  const renderBar = (
    value: number,
    colorClass: string,
    label: string,
    icon: string,
    max: number = 100
  ) => (
    <div className="flex flex-col mb-2 w-full">
      <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-pixel uppercase">
        <span>
          {icon} {label}
        </span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-3 w-full bg-zinc-900 border border-zinc-600 relative p-[1px]">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        />
        {/* Hiệu ứng bóng láng trên thanh bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 pointer-events-none" />
      </div>
    </div>
  );

  if (!playerStats.hasLantern && !propLanternId) return null;

  return (
    <div className="absolute top-4 left-4 p-4 bg-black/80 border-2 border-zinc-600 rounded-sm min-w-[240px] pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-30">
      {/* Avatar & Info */}
      <div className="flex gap-3 mb-4 border-b border-zinc-700 pb-3">
        <div className="w-12 h-12 bg-zinc-800 border border-zinc-500 flex items-center justify-center text-2xl shadow-inner">
          🧙‍♂️
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-amber-500 font-pixel text-sm">THE SEEKER</h2>
          <span className="text-[10px] text-zinc-500 font-mono truncate w-24">
            ID: {lanternId.slice(0, 6)}...
          </span>
        </div>
      </div>

      {/* Stats Bars */}
      {renderBar(
        health,
        "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]",
        "Sức khỏe",
        "❤️",
        100
      )}
      {renderBar(
        oil,
        "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]",
        "Đèn Dầu",
        "🔥",
        playerStats.MAX_OIL ?? 100
      )}
      {renderBar(
        sanity,
        "bg-purple-600",
        "Tinh thần",
        "👁️",
        playerStats.MAX_SANITY ?? 100
      )}

      {/* Status */}
      <div className="mt-2 pt-2 border-t border-zinc-700 flex justify-between items-center">
        <span className="text-[10px] text-zinc-500 font-pixel">TRẠNG THÁI</span>
        <span
          className={`text-[10px] font-bold font-pixel ${
            playerStats.isAlive ? "text-green-400" : "text-red-400"
          }`}
        >
          {playerStats.isAlive ? "CÒN SỐNG" : "ĐÃ CHẾT"}
        </span>
      </div>
    </div>
  );
}
