// app/play/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";
import GameBackground from "@/components/game/GameBackground";

export default function PlayPage() {
  const { hasLantern, lanternObjects, oil, isAlive, refetch } = usePlayerStats();
  const [lanternId, setLanternId] = useState<string | null>(
    lanternObjects.length > 0 ? lanternObjects[0].data.objectId : null
  );

  if (hasLantern && lanternObjects.length > 0 && !lanternId) {
    setLanternId(lanternObjects[0].data.objectId);
  }

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
            <div className="mt-6 w-full max-w-md">
              <GameActions
                lanternId={lanternId}
                oil={oil}
                isAlive={isAlive}
                onSuccess={() => setTimeout(() => refetch(), 1000)}
              />
            </div>
            
            {/* Link đến Story Mode Game */}
            <div className="mt-8 w-full max-w-md">
              <Link
                href="/game"
                className="block w-full text-center px-6 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg border-2 border-purple-900 transition-all shadow-lg font-pixel text-lg"
              >
                🎮 VÀO GAME STORY MODE
              </Link>
              <p className="text-center text-zinc-500 text-sm mt-2 font-pixel">
                Chơi màn chơi "Hành lang Gương" với đồ họa PixiJS
              </p>
            </div>
          </>
        ) : (
          <p className="text-zinc-400 font-pixel">Bạn chưa có Lantern, hãy bắt đầu một Run mới.</p>
        )}
      </div>
    </main>
  );
}