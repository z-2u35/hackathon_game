// components/user/NewsSection.tsx
"use client";

export default function NewsSection() {
  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Tin tức cá nhân hóa</h2>
      <ul className="text-zinc-200 list-disc list-inside">
        <li>✨ Cập nhật mới: 4 Whisper Skill đã được khai mở</li>
        <li>💰 Merchant Event: Vật phẩm hiếm giảm giá 48h</li>
        <li>⚖ Balancing Patch: Một số vật phẩm đã cập nhật chỉ số</li>
      </ul>
      <button className="mt-2 text-amber-400 font-pixel underline">Xem tất cả tin tức →</button>
    </section>
  );
}
