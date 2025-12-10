// components/home/NewsSection.tsx
"use client";

const newsItems = [
  "Cập nhật devlog",
  "Ra mắt NFT set đầu tiên",
  "Update gameplay",
  "AMA / Community event",
];

export default function NewsSection() {
  return (
    <section className="py-20 px-4 text-center bg-zinc-900 text-zinc-100">
      <h2 className="text-4xl font-pixel mb-6">Tin Tức Mới</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {newsItems.map((n, idx) => (
          <div key={idx} className="bg-zinc-800 p-6 rounded-lg shadow-md">{n}</div>
        ))}
      </div>
      <a href="/news" className="mt-6 inline-block font-pixel px-6 py-2 bg-amber-700 rounded hover:bg-amber-600 transition-all">
        → Xem tất cả tin tức
      </a>
    </section>
  );
}
