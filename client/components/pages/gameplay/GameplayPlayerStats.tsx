"use client";

export default function PlayerStats() {
  const stats = [
    { name: "HP ❤️", desc: "Mất khi bị tấn công/bẫy. 0 HP → chết vật lý, mất đồ." },
    { name: "SANITY 🧠", desc: "Ảnh hưởng ảo giác, UI, text game. SAN thấp → text nói dối 100%." },
    { name: "OIL 🛢", desc: "Tiêu hao theo thời gian. Hết dầu → chết ngay lập tức." },
  ];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">❤️ 2. Chỉ Số Sống Sót – HP / SANITY / OIL</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-700/80 p-4 rounded-lg border border-amber-300/30">
            <h3 className="font-bold">{stat.name}</h3>
            <p>{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
