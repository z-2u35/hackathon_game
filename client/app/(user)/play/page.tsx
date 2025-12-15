// app/play/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";
import GameBackground from "@/components/game/GameBackground";
import MirrorHallwayGame from "@/components/game/rooms/MirrorHallwayGame";
import GameInterface from "@/components/game/GameInterface";
import { addGameLog } from "@/components/game/ActionLog";

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
                    className="block cursor-pointer w-full text-center px-6 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg border-2 border-purple-900 transition-all shadow-lg font-pixel text-lg"
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
              // Layout game mode với GameInterface
              <div className="flex-1 relative w-full h-full">
                <GameInterface
                  onMove={() => {
                    addGameLog("Bạn đang di chuyển...", "info");
                    // TODO: Implement move logic
                  }}
                  onInteract={() => {
                    addGameLog("Bạn đang tương tác với vật thể...", "info");
                  }}
                  canMove={isAlive !== false && (oil ?? 1) > 0}
                  items={
                    gameResults?.item
                      ? [
                          {
                            id: "1",
                            name: gameResults.item,
                            icon: "📦",
                            description: `Vật phẩm: ${gameResults.item}`,
                            type: "tool",
                          },
                        ]
                      : []
                  }
                  onUseItem={(item) => {
                    addGameLog(`Đã sử dụng: ${item.name}`, "success");
                  }}
                >
                  {/* Isometric Game Canvas */}
                  <div className="w-full h-full">
                    <MirrorHallwayGame
                      onChoice={(choiceId, result) => {
                        handleGameChoice(choiceId, result);
                        // Add log entries
                        if (result.hp) {
                          addGameLog(
                            `HP ${result.hp > 0 ? "+" : ""}${result.hp}`,
                            result.hp > 0 ? "success" : "error"
                          );
                        }
                        if (result.oil) {
                          addGameLog(
                            `Oil ${result.oil > 0 ? "+" : ""}${result.oil}`,
                            result.oil > 0 ? "success" : "warning"
                          );
                        }
                        if (result.sanity) {
                          addGameLog(
                            `Sanity ${result.sanity > 0 ? "+" : ""}${result.sanity}`,
                            result.sanity > 0 ? "success" : "warning"
                          );
                        }
                        if (result.item) {
                          addGameLog(`Nhận được: ${result.item}`, "success");
                        }
                        if (result.code) {
                          addGameLog(`Mã: ${result.code}`, "success");
                        }
                      }}
                    />
                  </div>
                </GameInterface>

                {/* Nút quay lại - Overlay */}
                <div className="absolute top-4 left-4 z-40 flex gap-2">
                  <button
                    onClick={() => setShowGame(false)}
                    className="px-4 cursor-pointer py-2 bg-zinc-700/90 hover:bg-zinc-600 text-white rounded-lg border-2 border-zinc-600 transition-all font-pixel backdrop-blur-sm"
                  >
                    ← Quay lại
                  </button>
                  <Link
                    href="/game"
                    className="px-4 py-2 cursor-pointer bg-amber-600/90 hover:bg-amber-500 border-2 border-amber-800 rounded font-pixel transition-all backdrop-blur-sm"
                  >
                    Chế độ Game Full
                  </Link>
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
