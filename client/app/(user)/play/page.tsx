// app/play/page.tsx
"use client";

import { useState } from "react";
import { usePlayerStats } from "@/hook/usePlayerStats";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";

export default function PlayPage() {
  const { hasLantern, lanternObjects, refetch } = usePlayerStats();
  const [lanternId, setLanternId] = useState<string | null>(
    lanternObjects.length > 0 ? lanternObjects[0].data.objectId : null
  );

  // Nếu lanternObjects thay đổi, update lanternId
  if (hasLantern && lanternObjects.length > 0 && !lanternId) {
    setLanternId(lanternObjects[0].data.objectId);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-pixel text-amber-300 mb-4">Chơi</h1>

      {hasLantern && lanternId ? (
        <>
          <GameHUD />
          <div className="mt-6 w-full max-w-md">
            <GameActions
              lanternId={lanternId}
              onSuccess={() => setTimeout(() => refetch(), 1000)}
            />
          </div>
        </>
      ) : (
        <p className="text-zinc-400 font-pixel">Bạn chưa có Lantern, hãy bắt đầu một Run mới.</p>
      )}
    </main>
  );
}
