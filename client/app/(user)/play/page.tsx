// app/play/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";
import GameBackground from "@/components/game/GameBackground";
import MirrorHallwayGame from "@/components/game/MirrorHallwayGame";

export default function PlayPage() {
  const { hasLantern, lanternObjects, oil, isAlive, refetch } = usePlayerStats();
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
    <main className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center gap-6 relative overflow-hidden">
      {/* PixiJS Background */}
      <GameBackground intensity="medium" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        <h1 className="text-3xl font-pixel text-amber-300 mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
          Chơi
        </h1>

        {hasLantern && lanternId ? (
          <>
            <GameHUD />
            
            {!showGame ? (
              <>
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
                    Chơi màn chơi "Hành lang Gương" với đồ họa PixiJS isometric
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Game Canvas */}
                <div className="w-full max-w-5xl h-[600px] border-2 border-amber-600 rounded-lg overflow-hidden bg-black/50 relative">
                  <MirrorHallwayGame onChoice={handleGameChoice} />
                </div>
                
                {/* Nút quay lại */}
                <button
                  onClick={() => setShowGame(false)}
                  className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg border-2 border-zinc-600 transition-all font-pixel"
                >
                  ← Quay lại
                </button>
              </>
            )}

            {/* Hiển thị kết quả game */}
            {gameResults && (
              <div className="mt-4 w-full max-w-md bg-zinc-900/95 border-2 border-amber-600 p-4 rounded-lg font-pixel text-sm">
                <h3 className="text-amber-400 mb-2">Kết quả:</h3>
                {gameResults.hp && (
                  <p className={gameResults.hp > 0 ? "text-green-400" : "text-red-400"}>
                    HP: {gameResults.hp > 0 ? "+" : ""}{gameResults.hp}
                  </p>
                )}
                {gameResults.oil && (
                  <p className={gameResults.oil > 0 ? "text-green-400" : "text-red-400"}>
                    Oil: {gameResults.oil > 0 ? "+" : ""}{gameResults.oil}
                  </p>
                )}
                {gameResults.sanity && (
                  <p className={gameResults.sanity > 0 ? "text-green-400" : "text-red-400"}>
                    Sanity: {gameResults.sanity > 0 ? "+" : ""}{gameResults.sanity}
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
          </>
        ) : (
          <p className="text-zinc-400 font-pixel">Bạn chưa có Lantern, hãy bắt đầu một Run mới.</p>
        )}
      </div>
    </main>
  );
}