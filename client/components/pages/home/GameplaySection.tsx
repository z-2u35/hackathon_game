// components/home/GameplaySection.tsx
"use client";


const highlights = [
  { title: "🏃 Khám Phá 5 Phòng – 5 Dạng Ác Mộng", desc: "Gương phản chiếu sai, tiếng vọng vô hình, hồ ký ức, cửa ảo giác… Mỗi run là một bản đồ mới." },
  { title: "🩸 Combat Văn Bản – Tàn Nhẫn Nhưng Chiến Lược", desc: "Attack, Focus Light, Whisper… Quái càng sợ ánh sáng → bạn càng sống sót." },
  { title: "🪞 Đối Thủ Cuối Cùng: Chính Bạn", desc: "Boss cuối là bản thể run trước của bạn, với đúng trang bị và chỉ số tương đương." },
];

export default function GameplaySection() {
  return (
    <section className="py-20 px-4 bg-zinc-800 text-zinc-100 text-center">
      <h2 className="text-4xl font-pixel mb-6">Một Roguelike nơi mọi quyết định sẽ có con giá phải trả cá</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {highlights.map((item, idx) => (
          <div key={idx} className="bg-zinc-900 p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-zinc-300">{item.desc}</p>
          </div>
        ))}
      </div>
      <a href="/gameplay" className="mt-6 inline-block font-pixel px-6 py-2 bg-amber-700 rounded hover:bg-amber-600 transition-all">
        → Xem chi tiết Gameplay
      </a>
    </section>
  );
}
