// components/layouts/user/background/LoadBackground.tsx
"use client";

export default function LoadBackground() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white font-pixel">
      {/* Background hình ảnh hoặc gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-900 to-zinc-800 opacity-80"></div>

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-pulse text-4xl md:text-6xl">ASTEROS</div>
        <div className="text-lg md:text-2xl text-amber-400 animate-pulse">
          Đang tải trang…
        </div>
      </div>
    </div>
  );
}
