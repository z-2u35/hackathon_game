"use client";

const filters = [
  "Tất cả",
  "Thông báo",
  "Cập nhật phiên bản",
  "Sự kiện",
  "Lore Mới",
  "Behind the Scenes",
];

export default function NewsFilterBar() {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-6 border-b border-zinc-800">
      {filters.map((item) => (
        <button
          key={item}
          className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition font-pixel text-sm"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
