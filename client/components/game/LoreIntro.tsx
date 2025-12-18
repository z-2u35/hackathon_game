"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameLogo from "./GameLogo";

interface LoreIntroProps {
  onComplete: () => void;
  skipable?: boolean;
}

export default function LoreIntro({ onComplete, skipable = true }: LoreIntroProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const loreChapters = [
    {
      title: "KỶ NGUYÊN ÁNH SÁNG GIẢ TẠO",
      subtitle: "The Era of False Light",
      content: `Trước khi mọi thứ sụp đổ, Asteros là một đế chế nằm sâu dưới lòng đất — nơi mà ánh sáng không đến từ mặt trời, mà đến từ Những Tinh Thể Lân Quang do địa mạch sản sinh.

Ánh sáng ấy đẹp đến siêu thực, khiến người Asteros tin rằng họ đã được chọn bởi các vị thần cổ đại.

Nhưng Asteros chỉ rực rỡ ở bề mặt. Đằng sau những chiếc mặt nạ đẹp đẽ là: sự nghi kỵ, phản bội, những khao khát bị bóp nghẹt.

Một thiên đường giả tạo, dựng xây bằng sự dối trá.`,
      quote: "“Khi sự thật bị che khuất, nỗi đau cũng được chôn vùi.”\n— Giáo Luật Cổ",
      icon: "✨",
    },
    {
      title: "NGỌN ĐÈN RƠI",
      subtitle: "The Fallen Lantern",
      content: `Năm Thiên Lịch 700, một thiên thạch xuyên qua lớp đá dày của thế giới ngầm và rơi thẳng vào cung điện Asteros.

Người ta thấy một chiếc đèn lồng kim loại cổ, phủ đầy ký hiệu không thuộc bất kỳ nền văn minh nào, phát sáng bằng một thứ ánh sáng hổ phách lạnh lẽo.

Nhà vua Aethelred là người đầu tiên chạm vào nó. Ngay khoảnh khắc ấy, ông nhìn thấy ảo ảnh trong tâm trí: Hoàng Hậu cầm dao găm, sẵn sàng ra tay...

Nhà vua hóa điên. Ngọn Đèn bắt đầu lan tỏa "Bức Xạ Sự Thật" — ai đứng trong ánh sáng của nó không thể nói dối.`,
      quote: "",
      icon: "🕯️",
    },
    {
      title: "SỰ SỤP ĐỔ TRONG 7 NGÀY",
      subtitle: "The Great Collapse",
      content: `Asteros không bị xâm lược. Asteros tự tiêu diệt chính mình.

Ngày 1: Các quan lại bắt đầu tàn sát nhau khi thấy toàn bộ âm mưu, phản trắc.

Ngày 3: Dân chúng xé mặt nạ của nhau, buộc nhau phải "thấy" sự thật.

Ngày 5: Cả thành phố chìm trong biển máu. Những con Phantoms do cảm xúc tiêu cực sinh ra bắt đầu tấn công mọi thứ sống.

Ngày 7: Chỉ còn Nữ Hoàng Kế Vị — mù bẩm sinh, không thể thấy ảo ảnh — mang Ngọn Đèn xuống The Void và phong ấn chính mình cùng nó.

Từ ngày đó, Asteros trở thành một nấm mồ vĩnh hằng.`,
      quote: "",
      icon: "💀",
    },
    {
      title: "BẠN – THE SEEKER",
      subtitle: "Bản thể thứ 10,492",
      content: `Bạn không phải là người đầu tiên đi vào Asteros.

Bạn là bản sao thứ 10,492 của một chiến binh vô danh từng lạc vào hầm ngục 500 năm trước.

Mỗi phiên bản trước bạn đều: chết, hoặc mất trí, hoặc trở thành Phantom vĩnh viễn.

Ký ức của họ chảy mơ hồ trong huyết quản bạn: những đoạn rời rạc, méo mó, như giọng nói ai đó gọi từ phía cuối hành lang vô tận.

Nhưng bạn khác với các bản thể trước. Một ký ức không thuộc về vòng lặp vẫn còn sót lại — ký ức về Nữ Hoàng Kế Vị.

Nó khiến Ngọn Đèn... sợ bạn.`,
      quote: "",
      icon: "👤",
    },
    {
      title: "HÀNH TRÌNH BẮT ĐẦU",
      subtitle: "The Journey Begins",
      content: `Mục tiêu của bạn không phải chỉ để sống sót.

Mà là đi sâu hơn bất kỳ bản thể nào từng tồn tại.

Đến nơi mà chính Nữ Hoàng đã biến mất.

Và tìm ra lý do vì sao Ngọn Đèn chọn bạn.

Asteros không chỉ là một hầm ngục. Nó là một ký ức của vũ trụ, đang phân rã.

Và bạn là mảnh ghép cuối cùng mà nó còn thiếu...`,
      quote: "",
      icon: "🌑",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentChapter < loreChapters.length - 1) {
        setCurrentChapter((prev) => prev + 1);
      } else {
        // Auto proceed to game after last chapter
        setTimeout(() => {
          handleComplete();
        }, 3000);
      }
    }, 8000); // 8 seconds per chapter

    return () => clearTimeout(timer);
  }, [currentChapter]);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNext = () => {
    if (currentChapter < loreChapters.length - 1) {
      setCurrentChapter((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  if (!isVisible) return null;

  const chapter = loreChapters[currentChapter];
  const progress = ((currentChapter + 1) / loreChapters.length) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black text-white font-pixel overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f1a 50%, #0a0a0a 100%)",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-16">
        {/* Chapter Icon */}
        <div className="text-8xl mb-8 animate-pulse">{chapter.icon}</div>

        {/* Chapter Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
            {chapter.title}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-mono">{chapter.subtitle}</p>
        </div>

        {/* Quote (if exists) */}
        {chapter.quote && (
          <div className="text-center mb-8 max-w-2xl">
            <p className="text-lg text-purple-300 italic border-l-4 border-purple-500 pl-4 font-serif">
              {chapter.quote}
            </p>
          </div>
        )}

        {/* Content Text */}
        <div className="max-w-4xl text-center mb-12">
          <div className="text-base md:text-lg text-zinc-200 leading-relaxed whitespace-pre-line">
            {chapter.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-zinc-500 mt-2">
            {currentChapter + 1} / {loreChapters.length}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
          {skipable && (
            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-zinc-500 rounded-lg text-sm font-pixel transition-all"
            >
              Bỏ qua
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 border-2 border-amber-500 hover:border-amber-400 rounded-lg text-sm font-pixel transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          >
            {currentChapter < loreChapters.length - 1 ? "Tiếp theo →" : "Bắt đầu"}
          </button>
        </div>
      </div>

      {/* Fade overlay for transitions */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

