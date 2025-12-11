// components/user/ProgressOverview.tsx
"use client";

import GameHUD from "@/components/game/GameHUD";

interface ProgressOverviewProps {
  hasLantern: boolean;
}

export default function ProgressOverview({ hasLantern }: ProgressOverviewProps) {
  if (!hasLantern) return null;

  return (
    <section className="w-full max-w-sm m-4 p-4 bg-zinc-900/70 border border-zinc-800 rounded-md">
      <GameHUD />
    </section>
  );
}
