// components/user/TasksSection.tsx
"use client";

export default function TasksSection() {
  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Nhiệm vụ đang dở</h2>
      <div className="flex flex-col gap-2">
        <div>
          <strong>📌 Nhiệm vụ hôm nay (Daily)</strong>
          <ul className="list-disc list-inside text-zinc-200">
            <li>Khám phá 1 phòng mới → +10 SHARDS</li>
            <li>Giữ SAN trên 60 trong 1 phút → +1 Random Consumable</li>
            <li>Tương tác với Merchant of Whispers → +5 SHARDS</li>
          </ul>
        </div>
        <div>
          <strong>📅 Nhiệm vụ tuần (Weekly)</strong>
          <ul className="list-disc list-inside text-zinc-200">
            <li>Hoàn thành 1 Run → Badge “Loopbreaker”</li>
            <li>Burn 1 Item tại Memory Pool → +NFT Random</li>
            <li>Đánh bại Mini Boss → +Epic Loot</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
