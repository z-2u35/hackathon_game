// components/game/GameHUD.tsx
"use client";

import { usePlayerStats } from "@/hook/usePlayerStats";
import { FaHeart, FaTint, FaBrain } from "react-icons/fa";

export default function GameHUD() {
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
  } = usePlayerStats();

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
    <div className="w-full max-w-sm bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-left font-pixel">
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
              {/* Thanh pixel gradient */}
              <div className="w-full h-4 bg-zinc-700 rounded overflow-hidden relative">
                <div
                  className={`h-full rounded transition-all duration-300 bg-linear-to-r ${stat.gradient}`}
                  style={{
                    width: `${percentage}%`,
                    backgroundSize: "4px 4px", // tạo hiệu ứng pixel
                  }}
                ></div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-between mt-3">
          <span className="text-zinc-400">TRẠNG THÁI</span>
          <span className="font-medium text-green-400">CÒN SỐNG</span>
        </div>
      </div>
    </div>
  );
}
