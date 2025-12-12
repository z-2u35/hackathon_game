"use client";

import { useEffect, useState } from "react";

export default function UserLoreSection() {
  const loreLines = [
    "Bạn đã bước qua Đại Sảnh Khúc Xạ - Hall of Refractions, nơi phản chiếu bản thể méo mó… và nhận ra chính mình cũng là một bí ẩn chưa giải mã. ",
    "Âm vang bước chân từ hư vô vọng lại từ vực thẳm… một thực thể vô hình đang truy dấu, nhưng chưa thể vươn móng vuốt tới bạn. ",
    "Âm thanh từ Ngọn Đèn dội lại không ngừng, dồn dập như nhịp trống chiến trận… sự kiên nhẫn đã cạn, và điều gì đó khủng khiếp đang đến gần. "
  ];

  const [displayedLines, setDisplayedLines] = useState<string[]>(Array(loreLines.length).fill(""));

  useEffect(() => {
    let currentLine = 0;
    let currentText = "";
    let interval: number = 0;

    const typeLine = () => {
      const fullText = loreLines[currentLine];
      interval = window.setInterval(() => {
        currentText += fullText[currentText.length];
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[currentLine] = currentText;
          return newLines;
        });

        if (currentText.length === fullText.length) {
          window.clearInterval(interval);
          currentLine++;
          currentText = "";
          if (currentLine < loreLines.length) {
            setTimeout(typeLine, 400);
          }
        }
      }, 30);
    };

    typeLine();
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full m-5 bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Dòng ghi chú hành trình (Run Log)</h2>
      <ul className="list-none text-zinc-200 min-h-24 flex flex-col gap-2">
        {displayedLines.map((line, i) => (
          <li key={i} className="overflow-hidden whitespace-pre-wrap">
            {line}
            <span className="animate-blink ml-2">|</span>
          </li>
        ))}
      </ul>
      <button className="mt-3 text-amber-400 cursor-pointer font-pixel underline hover:text-amber-300">
        XEM TOÀN BỘ LORE ĐÃ MỞ KHÓA →
      </button>

      <style jsx>{`
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
