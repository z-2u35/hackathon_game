"use client";

import Image from "next/image";

const teamMembers = [
  { role: "Leader/Fullstack", name: "[Tên Leader]" },
  { role: "Frontend Developer", name: "[Tên Frontend]" },
  { role: "UI/UX Designer", name: "[Tên Designer]" },
  { role: "Content/Audio", name: "[Tên Âm Thanh]" },
];

export default function AboutUs() {
  return (
    <div className="origin-top-center max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-6 text-center">
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image
            src="/img/TeamLogo.png"
            alt="Team Logo"
            width={150}
            height={120}
            className="rounded-xl shadow-lg bg-white shadow-amber-300/30 scale-[1.4] transition-transform hover:scale-150"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-gradient bg-clip-text text-transparent from-amber-400 via-orange-400 to-pink-400 tracking-wide">
          Flash Woves
        </h2>

        <p className="text-zinc-200 text-base md:text-lg leading-relaxed">
          Chúng tôi là một nhóm indie developers đến từ cuộc thi{" "}
          <strong className="text-amber-300">SUI Hackathon Game X VLU</strong>.
          Tất cả cùng chung mục tiêu xây dựng một thế giới giả tưởng đầy ánh
          sáng, bóng tối và những câu chuyện sâu sắc xoay quanh{" "}
          <strong className="text-pink-400">Lanterns</strong>.
        </p>

        {/* DANH SÁCH THÀNH VIÊN */}
        <div className="pt-2 text-left space-y-2">
          {teamMembers.map((item, index) => (
            <p key={index} className="text-zinc-200">
              <span className="text-amber-400 font-semibold">{item.role}:</span>{" "}
              {item.name}
            </p>
          ))}
        </div>

        <p className="pt-3 text-zinc-300 text-sm md:text-base italic">
          Credit cho toàn bộ nội dung, hình ảnh và ý tưởng thuộc về đội ngũ{" "}
          <strong className="text-amber-400"> Flash Woves</strong>, sử dụng cho
          mục đích phát triển game và trình diễn Hackathon.
        </p>
      </div>
    </div>
  );
}
