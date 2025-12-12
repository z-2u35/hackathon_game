// components/user/TasksSection.tsx
"use client";

import { useMemo } from "react";

export default function TasksSection() {
  const dailyTasks = useMemo(
    () => [
      "Khám phá 1 phòng mới → +10 SHARDS",
      "Giữ SAN trên 60 trong 1 phút → +1 Random Consumable",
      "Tương tác với Merchant of Whispers → +5 SHARDS",
      "Thu thập 3 Oil Cans → +5 SHARDS",
      "Hoàn thành Mini Puzzle → +1 Random Consumable",
    ],
    []
  );

  const weeklyTasks = useMemo(
    () => [
      "Hoàn thành 1 Run → Badge “Loopbreaker”",
      "Burn 1 Item tại Memory Pool → +NFT Random",
      "Đánh bại Mini Boss → +Epic Loot",
      "Khám phá toàn bộ Floor 1 → +Rare Loot",
      "Tương tác với 3 NPC → +3 SHARDS",
    ],
    []
  );

  const shuffleArray = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

  const dailyDisplay = useMemo(() => shuffleArray(dailyTasks).slice(0, 3), [dailyTasks]);
  const weeklyDisplay = useMemo(() => shuffleArray(weeklyTasks).slice(0, 3), [weeklyTasks]);

  // Pixel checklist component
  const PixelItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-2">
      <span className="w-4 h-4 bg-zinc-700 border border-zinc-500 rounded-sm block"></span>
      <span className="text-zinc-200 font-pixel">{text}</span>
    </li>
  );

  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Nhiệm vụ đang dở</h2>
      <div className="flex flex-col gap-4">
        <div>
          <strong>📌 Nhiệm vụ hôm nay (Daily)</strong>
          <ul className="mt-2 flex flex-col gap-1">
            {dailyDisplay.map((task, i) => (
              <PixelItem key={i} text={task} />
            ))}
          </ul>
        </div>
        <div>
          <strong>📅 Nhiệm vụ tuần (Weekly)</strong>
          <ul className="mt-2 flex flex-col gap-1">
            {weeklyDisplay.map((task, i) => (
              <PixelItem key={i} text={task} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
