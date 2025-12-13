// components/user/UserHeroSection.tsx
"use client";

import Link from "next/link";
import { usePlayerStats } from "@/hook/usePlayerStats"; // đúng folder: hooks, không phải hook

export default function UserHeroSection() {
  const { MAX_SANITY } = usePlayerStats(); // lấy từ hook
  const subheading =
    MAX_SANITY > 70
      ? "Tâm trí bạn rực sáng, ngọn lửa ý chí bùng nổ, soi đường cho bước chân tiến vào miền thử thách mới."
      : MAX_SANITY >= 50
      ? "Những tiếng thì thầm chưa thể khuất phục bạn… nhưng bóng tối đang rình rập, hãy bước đi với sự cảnh giác."
      : MAX_SANITY > 0
      ? "Có thứ gì đó đang bám theo từng nhịp thở của bạn… liệu bạn đủ can đảm để tiến bước?"
      : "Ngọn Đèn vẫn cháy âm ỉ trong bóng tối, chờ bạn trở lại để thắp sáng vận mệnh.";

  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-center font-pixel">
      <h1 className="text-4xl text-amber-300 mb-2">Chào mừng trở lại, Seeker.</h1>
      <p className="text-zinc-200 text-lg">{subheading}</p>
      <div className="mt-4 flex justify-center gap-4 flex-wrap">
       <Link
          href="/play"
          className="bg-amber-400 text-zinc-900 px-4 py-2 rounded-md font-pixel hover:bg-amber-300"
        >
          TIẾP TỤC RUN
        </Link>
        <Link
          href="/game"
          className="bg-purple-600 text-white px-4 py-2 rounded-md font-pixel hover:bg-purple-500"
        >
          🎮 VÀO GAME
        </Link>
        <button className="bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md font-pixel hover:bg-zinc-600">
          KHO NFT CỦA BẠN
        </button>
        <button className="bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md font-pixel hover:bg-zinc-600">
          XEM CÁC THAY ĐỔI GẦN ĐÂY
        </button>
      </div>
    </section>
  );
}
