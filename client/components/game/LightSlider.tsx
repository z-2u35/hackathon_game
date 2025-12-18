"use client";

import { useState, useEffect } from "react";
import { addGameLog } from "./ActionLog";

interface LightSliderProps {
  lightLevel?: number;
  onLightChange?: (level: number) => void;
  oil?: number;
  sanity?: number;
}

export default function LightSlider({
  lightLevel: propLightLevel = 50,
  onLightChange,
  oil = 100,
  sanity = 100,
}: LightSliderProps) {
  const [lightLevel, setLightLevel] = useState(propLightLevel);
  const [isDragging, setIsDragging] = useState(false);

  // Determine mode based on light level
  const getMode = (level: number) => {
    if (level <= 30) return "stealth";
    if (level <= 70) return "normal";
    return "truth";
  };

  const mode = getMode(lightLevel);

  // Update light level
  const handleChange = (value: number) => {
    const newLevel = Math.max(0, Math.min(100, value));
    setLightLevel(newLevel);
    onLightChange?.(newLevel);

    // Log mode changes
    const newMode = getMode(newLevel);
    if (newMode !== getMode(lightLevel)) {
      if (newMode === "stealth") {
        addGameLog('<span class="text-blue-400">👁️ Chế độ Ẩn nấp: Tiết kiệm Dầu, tăng nguy cơ...</span>', "info");
      } else if (newMode === "truth") {
        addGameLog('<span class="text-amber-400">☀️ Chế độ Sự Thật: Tốn Dầu gấp đôi, giảm Sanity nhanh!</span>', "warning");
      } else {
        addGameLog('<span class="text-zinc-300">🕯️ Chế độ Bình thường</span>', "info");
      }
    }
  };

  // Calculate oil consumption rate
  const getOilConsumptionRate = () => {
    if (mode === "stealth") return 0.5; // 50% consumption
    if (mode === "truth") return 2.0; // 200% consumption
    return 1.0; // 100% consumption
  };

  // Calculate sanity drain rate
  const getSanityDrainRate = () => {
    if (mode === "truth") return 1.5; // 150% drain
    return 1.0;
  };

  // Get mode icon
  const getModeIcon = () => {
    if (mode === "stealth") return "👁️";
    if (mode === "truth") return "☀️";
    return "🕯️";
  };

  // Get mode color
  const getModeColor = () => {
    if (mode === "stealth") return "text-blue-400";
    if (mode === "truth") return "text-amber-400";
    return "text-amber-300";
  };

  // Get slider track color
  const getTrackColor = () => {
    if (mode === "stealth") return "bg-blue-600";
    if (mode === "truth") return "bg-amber-500";
    return "bg-amber-400";
  };

  // Apply visual effects based on mode
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "stealth") {
      root.style.filter = "brightness(0.6)";
    } else if (mode === "truth") {
      root.style.filter = "brightness(1.2)";
    } else {
      root.style.filter = "brightness(1.0)";
    }

    return () => {
      root.style.filter = "brightness(1.0)";
    };
  }, [mode]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-30">
      <div className="bg-black/85 border-2 border-amber-600 p-3 rounded shadow-lg backdrop-blur-sm min-w-[300px] max-w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${getModeColor()}`}>{getModeIcon()}</span>
            <div>
              <div className="text-xs text-zinc-400 font-pixel uppercase">
                {mode === "stealth" ? "Ẩn nấp" : mode === "truth" ? "Sự thật" : "Bình thường"}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {lightLevel}% | Oil x{getOilConsumptionRate().toFixed(1)} | Sanity x{getSanityDrainRate().toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Track */}
          <div className="h-4 bg-zinc-900 border border-zinc-600 relative overflow-hidden rounded">
            {/* Fill */}
            <div
              className={`h-full ${getTrackColor()} transition-all duration-300 relative shadow-[0_0_10px_rgba(245,158,11,0.5)]`}
              style={{ width: `${lightLevel}%` }}
            >
              {/* Liquid effect for oil consumption */}
              {mode === "truth" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              )}
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </div>

            {/* Thumb */}
            <input
              type="range"
              min="0"
              max="100"
              value={lightLevel}
              onChange={(e) => handleChange(Number(e.target.value))}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{
                background: "transparent",
              }}
            />

            {/* Visual thumb indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-400 border-2 border-amber-600 rounded-full shadow-lg pointer-events-none transition-all"
              style={{
                left: `calc(${lightLevel}% - 12px)`,
                boxShadow: mode === "truth" ? "0 0 15px rgba(245,158,11,0.8)" : "0 0 8px rgba(245,158,11,0.5)",
              }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1 text-[8px] text-zinc-500 font-pixel">
            <span>0%</span>
            <span className={mode === "stealth" ? "text-blue-400" : ""}>30%</span>
            <span className={mode === "normal" ? "text-amber-400" : ""}>70%</span>
            <span className={mode === "truth" ? "text-amber-400" : ""}>100%</span>
          </div>
        </div>

        {/* Mode description */}
        <div className="mt-2 text-[10px] text-zinc-400 font-pixel text-center">
          {mode === "stealth" && "Tiết kiệm Dầu, tăng nguy cơ bị tấn công"}
          {mode === "normal" && "Cân bằng giữa ánh sáng và tài nguyên"}
          {mode === "truth" && "Tốn Dầu gấp đôi, giảm Sanity nhanh, nhìn thấy sự thật"}
        </div>
      </div>
    </div>
  );
}

