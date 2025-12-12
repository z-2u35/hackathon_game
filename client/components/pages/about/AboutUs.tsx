"use client";

import Image from "next/image";

const teamMembers = [
  { role: "Leader/Fullstack", name: "[Tên Leader]" },
  { role: "Frontend deverloper", name: "[Tên Artist]" },
  { role: "UI/UX Designer", name: "[Tên Designer]" },
  { role: "Content", name: "[Tên Âm Thanh]" },
];
export default function AboutUs() {
  return (
    <div className=" origin-top-center">
      <div className="space-y-4 text-center">
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image
            src="/img/TeamLogo.png"
            alt="Team Logo"
            width={150}
            height={120}
            className="rounded-xl shadow-lg m-2 bg-white shadow-amber-300/20 scale-[1.4]"
          />
        </div>

        <h2 className="text-xl font-bold text-amber-300 tracking-wide">
          Flash Woves
        </h2>

        <p className="text-zinc-200 leading-relaxed">
          Chúng tôi là một nhóm indie developers đến từ cuộc thi SUI Hackathon Game X VLU.
          Tất cả cùng chung mục tiêu xây dựng một thế giới giả tưởng đầy ánh
          sáng, bóng tối và những câu chuyện sâu sắc xoay quanh Lanterns.
        </p>

        {/* DANH SÁCH THÀNH VIÊN */}
        <div className="pt-2 text-left space-y-1">
          {teamMembers.map((item, index) => (
            <p key={index}>
              <span className="text-amber-400 font-semibold">
                {item.role}:
              </span>{" "}
              {item.name}
            </p>
          ))}
        </div>

        <p className="pt-3 text-zinc-300">
          Credit cho toàn bộ nội dung, hình ảnh và ý tưởng thuộc về đội ngũ
          ASTEROS, sử dụng cho mục đích phát triển game và trình diễn Hackathon.
        </p>
      </div>
    </div>
  );
}
