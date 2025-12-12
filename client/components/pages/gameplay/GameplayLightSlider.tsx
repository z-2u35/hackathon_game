"use client";

export default function LightSlider() {
  const modes = [
    {
      name: "Stealth",
      range: "0–30%",
      desc: "Quái vật khó phát hiện bạn, tiết kiệm dầu, nhưng dễ dẫm bẫy.",
    },
    {
      name: "Normal",
      range: "31–70%",
      desc: "Cân bằng, thấy bẫy và loot, tốn dầu trung bình.",
    },
    {
      name: "Truth",
      range: "71–100%",
      desc: "Thấy ảo giác → sự thật, nhận lore ẩn, sanity giảm nhanh.",
    },
  ];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">🔥 1. Hệ Thống Ánh Sáng – Light Slider</h2>
      <p className="mb-4">
        Ánh sáng càng mạnh, sự thật càng rõ — nhưng bạn càng tiến gần điên loạn.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <div key={mode.name} className="bg-zinc-700/80 p-4 rounded-lg border border-amber-300/30">
            <h3 className="font-bold">{mode.name} ({mode.range})</h3>
            <p>{mode.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
