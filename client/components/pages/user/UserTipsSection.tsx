// components/user/TipsSection.tsx
"use client";

import { usePlayerStats } from "@/hook/usePlayerStats";

export default function TipsSection() {
  const { hp, sanity, oil, hasLantern } = usePlayerStats();

  if (!hasLantern) return null;

  const tips: string[] = [];
  const dialogues: string[] = [];

  // SANITY
  if (sanity < 25) {
    tips.push("⚠ Sanity rất thấp! Nguy cơ mất kiểm soát cao, hãy tìm Sanity Pill ngay lập tức.");
    dialogues.push('"Tôi… tôi cảm thấy mọi thứ không còn thực… 👁"');
  } else if (sanity < 50) {
    tips.push("⚠ Sanity của bạn đang tan rã… hãy giảm độ sáng của Đèn và tìm Sanity Pill nếu cần.");
    dialogues.push('"Tôi cần giữ bình tĩnh… ánh sáng này giúp tôi ổn hơn."');
  } else if (sanity < 75) {
    tips.push("⚠ Sanity hơi thấp, hãy cẩn thận với các sự kiện tâm lý.");
    dialogues.push('"Mình hơi căng thẳng, phải cẩn thận…"');
  }

  // OIL
  if (oil < 25) {
    tips.push("🛢 Oil cực thấp! Ngọn Đèn sắp tắt, tìm Oil Cache ngay lập tức.");
    dialogues.push('"Ánh sáng sắp tắt… phải tìm thêm Oil!"');
  } else if (oil < 50) {
    tips.push("🛢 Ngọn Đèn của bạn đang lụi dần… tiết kiệm Oil bằng chế độ Stealth hoặc tìm Oil Cache.");
    dialogues.push('"Phải tiết kiệm Oil… đi nhẹ thôi."');
  } else if (oil < 75) {
    tips.push("🛢 Oil hơi thấp, hãy theo dõi mức tiêu thụ khi di chuyển.");
    dialogues.push('"Oil chưa đầy, nhưng vẫn còn ổn."');
  }

  // HP
  if (hp < 25) {
    tips.push("💔 HP cực thấp → cực kỳ nguy hiểm, tránh chiến đấu và tìm Health Pack ngay lập tức.");
    dialogues.push('"Tôi không chịu nổi thêm cú đánh nào nữa… 😢"');
  } else if (hp < 50) {
    tips.push("💔 HP thấp → cảnh giác với bẫy trong Twin Doors.");
    dialogues.push('"Đau quá… phải cẩn thận hơn."');
  } else if (hp < 75) {
    tips.push("💔 HP hơi thấp, chú ý khi đi qua các khu vực nguy hiểm.");
    dialogues.push('"Không quá tệ, nhưng vẫn nên cẩn thận."');
  }

  if (tips.length === 0) {
    tips.push("💡 Mọi thứ ổn định, hãy tiếp tục hành trình của bạn.");
    dialogues.push('"Tôi sẵn sàng cho bước tiếp theo. Hoặc không..."');
  }

  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Gợi ý Gameplay</h2>
      <ul className="list-disc list-inside text-zinc-200">
        {tips.map((tip, i) => (
          <li key={i}>
            {tip} <span className="text-amber-400 italic">{dialogues[i]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
