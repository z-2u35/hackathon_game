"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { usePlayerStats } from "@/hook/usePlayerStats";
import MirrorHallwayGame from "@/components/game/rooms/MirrorHallwayGame";
import GameHUD from "@/components/game/GameHUD";
import GameBackground from "@/components/game/GameBackground";
import Link from "next/link";

export default function GamePage() {
  const account = useCurrentAccount();
  const { hasLantern } = usePlayerStats();
  const [gameResults, setGameResults] = useState<{
    hp?: number;
    oil?: number;
    sanity?: number;
    item?: string;
    code?: string;
  } | null>(null);

  // Nếu chưa có lantern, yêu cầu mint
  if (!account || !hasLantern) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <div className="max-w-xl w-full border-4 border-zinc-800 bg-zinc-900/90 p-8 rounded-xl text-center flex flex-col gap-6">
          <h1 className="font-pixel text-4xl text-amber-400 mb-4">ASTEROS</h1>
          <p className="text-zinc-300 font-pixel">
            {!account
              ? "Vui lòng đăng nhập để chơi game."
              : "Bạn chưa có nhân vật. Hãy mint một Lantern để bắt đầu."}
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <Link
              href="/user"
              className="px-4 py-2 bg-amber-600 rounded font-pixel hover:bg-amber-500"
            >
              Về trang User
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-zinc-700 rounded font-pixel hover:bg-zinc-600"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleGameChoice = (
    choiceId: number,
    result: {
      hp?: number;
      oil?: number;
      sanity?: number;
      item?: string;
      code?: string;
    }
  ) => {
    setGameResults(result);
    // TODO: Gọi blockchain để update stats
    console.log("Game choice:", choiceId, result);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* PixiJS Background */}
      <GameBackground intensity="high" />

      {/* Layout 2 cột */}
      <div className="relative z-20 flex h-screen">
        {/* ===== LEFT HUD COLUMN ===== */}
        <aside className="w-72 shrink-0 mt-30 bg-zinc-900/80 border-r-2 border-amber-700 p-4 flex flex-col gap-4 z-40">
          <GameHUD />
        </aside>

        {/* ===== MAIN GAME AREA ===== */}
        <main className="flex-1 relative">
          {/* Canvas game */}
          <div className="w-full h-full pt-8 pb-24">
            <MirrorHallwayGame onChoice={handleGameChoice} />
          </div>

          {/* Game results */}
          {gameResults && (
            <div className="absolute top-6 right-6 bg-zinc-900/95 border-2 border-amber-600 p-4 rounded-lg font-pixel text-sm max-w-xs">
              <h3 className="text-amber-400 mb-2">Kết quả:</h3>

              {gameResults.hp !== undefined && (
                <p
                  className={
                    gameResults.hp > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  HP: {gameResults.hp > 0 ? "+" : ""}
                  {gameResults.hp}
                </p>
              )}

              {gameResults.oil !== undefined && (
                <p
                  className={
                    gameResults.oil > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  Oil: {gameResults.oil > 0 ? "+" : ""}
                  {gameResults.oil}
                </p>
              )}

              {gameResults.sanity !== undefined && (
                <p
                  className={
                    gameResults.sanity > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  Sanity: {gameResults.sanity > 0 ? "+" : ""}
                  {gameResults.sanity}
                </p>
              )}

              {gameResults.item && (
                <p className="text-green-400">Item: {gameResults.item}</p>
              )}

              {gameResults.code && (
                <p className="text-purple-400">Code: {gameResults.code}</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-80 flex gap-3 z-40">
        <Link
          href="/user"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 rounded font-pixel transition-all"
        >
          ← Về User
        </Link>
        <Link
          href="/play"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 rounded font-pixel transition-all"
        >
          Chế độ Play
        </Link>
      </div>
    </div>
  );
}
