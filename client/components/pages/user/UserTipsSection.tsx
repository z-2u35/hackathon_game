// components/user/TipsSection.tsx
"use client";

import { usePlayerStats } from "@/hook/usePlayerStats";

export default function TipsSection() {
  const { hp, sanity, oil, hasLantern } = usePlayerStats();

  if (!hasLantern) return null;

  const tips: string[] = [];

  if (sanity < 50) {
    tips.push(
      "⚠ Sanity của bạn đang tan rã… hãy giảm độ sáng của Đèn và tìm Sanity Pill nếu cần."
    );
  }

  if (oil < 50) {
    tips.push(
      "🛢 Ngọn Đèn của bạn đang lụi dần… tiết kiệm Oil bằng chế độ Stealth hoặc tìm Oil Cache."
    );
  }

  if (hp < 50) {
    tips.push("💔 HP thấp → cảnh giác với bẫy trong Twin Doors.");
  }

  if (tips.length === 0) {
    tips.push("💡 Mọi thứ ổn định, hãy tiếp tục hành trình của bạn.");
  }

  return (
    <section className="w-full bg-zinc-900/70 border border-zinc-800 p-6 rounded-md font-pixel">
      <h2 className="text-xl text-amber-300 mb-3">Gợi ý Gameplay</h2>
      <ul className="list-disc list-inside text-zinc-200">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
