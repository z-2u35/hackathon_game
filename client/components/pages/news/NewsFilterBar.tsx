"use client";

const filters = [
  "Tất cả",
  "Thông báo",
  "Cập nhật phiên bản",
  "Sự kiện",
  "Lore Mới",
  "Behind the Scenes",
];

export default function NewsFilterBar({
  activeFilter,
  onChange,
}: {
  activeFilter: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-6 border-b border-zinc-800">
      {filters.map((item) => {
        const isActive = activeFilter === item;

        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`relative px-4 py-2 rounded-full border font-pixel text-sm transition-all duration-300
    ${
      isActive
        ? "border-amber-500 text-amber-400 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-400 hover:scale-105"
    }`}
          >
            {item}

            {isActive && (
              <span className="absolute inset-0 rounded-full bg-amber-400/10 blur-md" />
            )}
          </button>
        );
      })}
    </div>
  );
}
