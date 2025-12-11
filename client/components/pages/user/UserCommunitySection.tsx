// components/user/CommunitySection.tsx
"use client";

export default function CommunitySection() {
  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="text-xl text-amber-300 mb-3 font-pixel">Community / Social Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-md font-pixel">
          ✨ Xếp hạng tuần → #14 trên bảng Loop Depth
        </div>
        <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-md font-pixel">
          🧩 Phòng Memory Pool gần đây → người chơi khác khắc 2 NFT
        </div>
        <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-md font-pixel">
          👥 Sự kiện cộng đồng → Vẽ The Seeker theo phong cách bạn
        </div>
      </div>
    </section>
  );
}
