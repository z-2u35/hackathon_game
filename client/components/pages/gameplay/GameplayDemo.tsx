"use client";
import Link from "next/link";

export default function DemoGameplay() {
  return (
    <div className="text-center text-white">
      <h1 className="text-4xl font-bold mb-4">The Lost Lantern – Ngọn đèn vô định</h1>
      <p className="text-lg mb-6">
        Ánh sáng là vũ khí. Sự thật là lời nguyền. Và mỗi lựa chọn đều phải trả giá.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/auth" className="px-6 py-2 bg-amber-700/40 border border-amber-500 rounded hover:bg-amber-600 transition-all">
          Play Demo
        </Link>
        <button className="px-6 py-2 bg-zinc-700/50 border border-amber-500 rounded hover:bg-zinc-600 transition-all">
          Xem Trailer
        </button>
      </div>
      {/* Gợi ý animation: The Seeker cầm đèn */}
    </div>
  );
}
