// components/home/FeaturesSection.tsx
"use client";

const features = [
  "zkLogin - Đăng nhập Google/Facebook, ví tự tạo.",
  "Dynamic NFT - Trang bị thay đổi theo ánh sáng, độ bền, nâng cấp.",
  "Kiosk Marketplace - Mua bán trong game, không phải rời ứng dụng.",
  "Shared Object - Vứt đồ xuống Hồ Ký Ức → nhận đồ người chơi khác.",
  "Leaderboard On-chain - Run nào cũng được ghi lại vĩnh viễn.",
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 text-center text-zinc-100">
      <h2 className="text-4xl font-pixel mb-6">Tính Năng Nổi Bật</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((f, idx) => (
          <li key={idx} className="bg-zinc-800 p-6 rounded-lg shadow-md">{f}</li>
        ))}
      </ul>
    </section>
  );
}
