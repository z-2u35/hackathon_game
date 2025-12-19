// app/play/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameActions from "@/components/game/GameActions";
import GameBackground from "@/components/game/GameBackground";
import GameInterface from "@/components/game/GameInterface";
import LoreIntro from "@/components/game/LoreIntro";

export default function PlayPage() {
  const { hasLantern, lanternObjects, oil, isAlive, refetch, hp, sanity } =
    usePlayerStats();
  const [lanternId, setLanternId] = useState<string | null>(
    lanternObjects.length > 0 ? lanternObjects[0].data.objectId : null
  );
  const [showLoreIntro, setShowLoreIntro] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameResults] = useState<{
    hp?: number;
    oil?: number;
    sanity?: number;
    item?: string;
    code?: string;
  } | null>(null);

  if (hasLantern && lanternObjects.length > 0 && !lanternId) {
    setLanternId(lanternObjects[0].data.objectId);
  }

  // Chặn scroll khi vào game - chỉ dùng CSS và preventDefault, không cố định body
  useEffect(() => {
    if (showGame) {
      // Chỉ thêm class để CSS xử lý
      document.body.classList.add('game-page-active');
      document.documentElement.classList.add('game-page-active');
    } else {
      document.body.classList.remove('game-page-active');
      document.documentElement.classList.remove('game-page-active');
    }
    
    return () => {
      document.body.classList.remove('game-page-active');
      document.documentElement.classList.remove('game-page-active');
    };
  }, [showGame]);


  return (
    <>
      {/* Lore Intro - Hiển thị trước khi vào game */}
      {showLoreIntro && (
        <LoreIntro
          onComplete={() => {
            setShowLoreIntro(false);
            setShowGame(true);
          }}
          skipable={true}
        />
      )}

      <main 
        className={`min-h-screen mt-50 bg-zinc-950 text-white relative overflow-hidden ${showGame ? 'h-screen' : 'min-h-screen'} overscroll-none`}
        style={{ 
          overscrollBehavior: 'none', 
          overflow: 'hidden',
          height: showGame ? '100vh' : 'auto',
          maxHeight: showGame ? '100vh' : 'none'
        }}
      >
      {/* PixiJS Background */}
      <GameBackground intensity="medium" />

      {/* Content Container */}
      <div className="relative z-10 mt-20 container mx-auto px-4 py-6 h-full flex flex-col overflow-hidden">
        {hasLantern && lanternId ? (
          <>
            {!showGame ? (
              // Layout chế độ chơi thông thường
              <div className="flex flex-col items-center gap-6 flex-1 justify-center">
                <h1 className="text-3xl font-pixel text-amber-300 mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  Chơi
                </h1>
             
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
                    onClick={() => setShowLoreIntro(true)}
                    className="block cursor-pointer w-full text-center px-6 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg border-2 border-purple-900 transition-all shadow-lg font-pixel text-lg"
                  >
                    🎮 VÀO GAME STORY MODE
                  </button>
                  <p className="text-center text-zinc-500 text-sm mt-2 font-pixel">
                    Bắt đầu hành trình vào Asteros - Bạn là bản thể thứ 10,492
                  </p>
                </div>
              </div>
            ) : (
              // Layout game mode với GameInterface mới (3 layers)
              <div className="flex-1 relative w-full h-full overflow-hidden">
                {/* GameInterface - Quản lý tất cả layers */}
                <GameInterface
                  stats={{
                    oil: oil ?? 0,
                    sanity: sanity ?? 0,
                    health: hp ?? 100,
                    stage: 1,
                  }}
                  inventory={
                    gameResults?.item
                      ? [
                          {
                            id: "1",
                            name: gameResults.item,
                            icon: "📦",
                            description: `Vật phẩm: ${gameResults.item}`,
                            type: "tool",
                            rarity: "common",
                          },
                        ]
                      : []
                  }
                  lanternId={lanternId ?? ""}
                  onRefresh={() => setTimeout(() => refetch(), 1000)}
                >
                  {/* IsometricLevel sẽ được render tự động nếu không có children */}
                  {/* Có thể pass MirrorHallwayGame nếu muốn dùng version cũ */}
                </GameInterface>

                {/* Nút quay lại - Overlay */}
                <div className="absolute top-20 right-4 z-40 flex gap-2 pointer-events-auto">
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
    </>
  );
}
