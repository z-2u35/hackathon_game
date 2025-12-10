// components/home/CharacterSection.tsx
"use client";

const characters = [
  { name: "The Seeker", desc: "Chiến binh bị tái tạo, gương mặt bị băng kín. Phá vỡ vòng lặp hoặc trở thành Phantom mãi mãi." },
  { name: "The Lantern", desc: "Thực Thể Ký Sinh Vũ Trụ. Lời nói thật đôi khi là cái bẫy." },
  { name: "The Fallen Queen", desc: "Hồn ma mù lòa, ghét ánh sáng. Giữ chìa khóa dẫn đến True Ending." },
];

export default function CharacterSection() {
  return (
    <section className="py-20 px-4 text-center bg-zinc-800 text-zinc-100">
      <h2 className="text-4xl font-pixel mb-6">Những Kẻ Lang Thang Trong Bóng Tối</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {characters.map((c, idx) => (
          <div key={idx} className="bg-zinc-900 p-6 rounded-lg shadow-md max-w-xs">
            <h3 className="font-bold text-xl mb-2">{c.name}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <a href="/characters" className="mt-6 inline-block font-pixel px-6 py-2 bg-amber-700 rounded hover:bg-amber-600 transition-all">
        → Gặp toàn bộ nhân vật
      </a>
    </section>
  );
}
