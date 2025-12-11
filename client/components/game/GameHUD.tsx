// components/game/GameHUD.tsx
"use client";

import { usePlayerStats } from "@/hook/usePlayerStats";

export default function GameHUD() {
  const {
    account,
    isLoading,
    isError,
    hasLantern,
    MAX_OIL,
    MAX_SANITY,
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

  return (
    <div className="w-full max-w-sm bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-left font-pixel">
      <h3 className="text-xl text-amber-300 mb-3">TRẠNG THÁI NHÂN VẬT</h3>

      <div className="flex flex-col gap-2 text-sm text-zinc-200">
        <div className="flex justify-between">
          <span className="text-zinc-400">OIL</span>
          <span className="font-mono">{MAX_OIL}/{MAX_OIL}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">SANITY</span>
          <span className="font-mono">{MAX_SANITY}/{MAX_SANITY}</span>
        </div>

        <div className="flex justify-between mt-3">
          <span className="text-zinc-400">TRẠNG THÁI</span>
          <span className="font-medium text-green-400">CÒN SỐNG</span>
        </div>
      </div>
    </div>
  );
}
