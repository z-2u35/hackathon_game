// components/user/LoreSection.tsx
"use client";

export default function LoreSection() {
  return (
    <section className="w-full m-5 bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Dòng ghi chú hành trình (Run Log)</h2>
      <ul className="list-disc list-inside text-zinc-200">
        <li>“Bạn đã bước qua Đại Sảnh Khúc Xạ - Hall of Refractions, nơi phản chiếu bản thể méo mó… và nhận ra chính mình cũng là một bí ẩn chưa giải mã.”</li>
        <li>“Âm vang bước chân từ hư vô vọng lại từ vực thẳm… một thực thể vô hình đang truy dấu, nhưng chưa thể vươn móng vuốt tới bạn.”</li>
        <li>“Âm thanh từ Ngọn Đèn dội lại không ngừng, dồn dập như nhịp trống chiến trận… sự kiên nhẫn đã cạn, và điều gì đó khủng khiếp đang đến gần.”</li>
      </ul>
      <button className="mt-3 text-amber-400 cursor-pointer font-pixel underline">XEM TOÀN BỘ LORE ĐÃ MỞ KHÓA →</button>
    </section>
  );
}
