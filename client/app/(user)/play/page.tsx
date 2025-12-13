// app/play/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";
import GameBackground from "@/components/game/GameBackground";
import MirrorHallwayGame from "@/components/game/rooms/MirrorHallwayGame";

export default function PlayPage() {
  const { hasLantern, lanternObjects, oil, isAlive, refetch } =
    usePlayerStats();
  const [lanternId, setLanternId] = useState<string | null>(
    lanternObjects.length > 0 ? lanternObjects[0].data.objectId : null
  );
  const [showGame, setShowGame] = useState(false);
  const [gameResults, setGameResults] = useState<{
    hp?: number;
    oil?: number;
    sanity?: number;
    item?: string;
    code?: string;
  } | null>(null);

  if (hasLantern && lanternObjects.length > 0 && !lanternId) {
    setLanternId(lanternObjects[0].data.objectId);
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
    console.log("Game choice:", choiceId, result);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* PixiJS Background */}
      <GameBackground intensity="medium" />

      {/* Content Container */}
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col scale-95 mt-20 origin-top">
        {hasLantern && lanternId ? (
          <>
            {!showGame ? (
              // Layout chế độ chơi thông thường
              <div className="flex flex-col items-center gap-6 flex-1 justify-center">
                <h1 className="text-3xl font-pixel text-amber-300 mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  Chơi
                </h1>
                <GameHUD />
                <div className="mt-6 w-full max-w-md">
                  <GameActions
                    lanternId={lanternId}
                    oil={oil}
                    isAlive={isAlive}
                    onSuccess={() => setTimeout(() => refetch(), 1000)}
                  />
                </div>

                {/* Nút để vào game */}
                <div className="mt-8 w-full max-w-md">
                  <button
                    onClick={() => setShowGame(true)}
                    className="block w-full text-center px-6 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg border-2 border-purple-900 transition-all shadow-lg font-pixel text-lg"
                  >
                    🎮 VÀO GAME STORY MODE
                  </button>
                  <p className="text-center text-zinc-500 text-sm mt-2 font-pixel">
                    Chơi màn chơi &quot;Hành lang Gương&quot; với đồ họa PixiJS
                    isometric
                  </p>
                </div>
              </div>
            ) : (
              // Layout game mode với 2 cột
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* Cột trái: Stats */}
                <div className="lg:col-span-1 flex flex-col">
                  <GameHUD />
                  <div className="mt-4">
                    <GameActions
                      lanternId={lanternId}
                      oil={oil}
                      isAlive={isAlive}
                      onSuccess={() => setTimeout(() => refetch(), 1000)}
                    />
                  </div>
                </div>

                {/* Cột giữa/phải: Game Canvas */}
                <div className="lg:col-span-2 flex flex-col gap-4 relative">
                  {/* Results box ở góc trên phải */}
                  {gameResults && (
                    <div className="absolute top-0 right-0 bg-zinc-900/95 border-2 border-amber-600 p-3 rounded-lg font-pixel text-sm max-w-xs z-10">
                      <h3 className="text-amber-400 mb-2 text-xs">Kết quả:</h3>
                      {gameResults.hp && (
                        <p
                          className={
                            gameResults.hp > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                          style={{ fontSize: "11px" }}
                        >
                          HP: {gameResults.hp > 0 ? "+" : ""}
                          {gameResults.hp}
                        </p>
                      )}
                      {gameResults.oil && (
                        <p
                          className={
                            gameResults.oil > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                          style={{ fontSize: "11px" }}
                        >
                          Oil: {gameResults.oil > 0 ? "+" : ""}
                          {gameResults.oil}
                        </p>
                      )}
                      {gameResults.sanity && (
                        <p
                          className={
                            gameResults.sanity > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                          style={{ fontSize: "11px" }}
                        >
                          Sanity: {gameResults.sanity > 0 ? "+" : ""}
                          {gameResults.sanity}
                        </p>
                      )}
                      {gameResults.item && (
                        <p
                          className="text-green-400"
                          style={{ fontSize: "11px" }}
                        >
                          Item: {gameResults.item}
                        </p>
                      )}
                      {gameResults.code && (
                        <p
                          className="text-purple-400"
                          style={{ fontSize: "11px" }}
                        >
                          Code: {gameResults.code}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Game Canvas */}
                  <div className="flex-1 border-2 border-amber-600 rounded-lg overflow-hidden bg-black/50 relative min-h-125">
                    <MirrorHallwayGame onChoice={handleGameChoice} />
                  </div>

                  {/* Nút quay lại */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setShowGame(false)}
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg border-2 border-zinc-600 transition-all font-pixel"
                    >
                      ← Quay lại
                    </button>
                    <Link
                      href="/game"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 rounded font-pixel transition-all"
                    >
                      Chế độ Game Full
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-zinc-400 font-pixel text-xl">
              Bạn chưa có Lantern, hãy bắt đầu một Run mới.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
