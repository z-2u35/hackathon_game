export type HelpItem = {
  question: string;
  answer: string;
};

export const gameplayData: HelpItem[] = [
  {
    question: "Ánh sáng (Light Slider) nên điều chỉnh thế nào?",
    answer: `• Truth (71–100%):
Tiêu thụ OIL gấp đôi, SAN giảm nhanh (5/s).
Tăng tỉ lệ đánh trúng, lộ vật phẩm & mã ẩn.

• Normal (31–70%):
Cân bằng – phù hợp di chuyển.

• Stealth (0–30%):
Tiết kiệm OIL, đánh nhau gần như luôn MISS.`,
  },
  {
    question: "Hết OIL thì sao?",
    answer:
      "Hết OIL đồng nghĩa bóng tối nuốt chửng bạn → Instant Death.",
  },
];

export const web3Data: HelpItem[] = [
  {
    question: "Soulbound NFT là gì?",
    answer:
      "NFT gắn vĩnh viễn với ví, không thể giao dịch. Dùng làm chứng chỉ kinh nghiệm.",
  },
];

export const supportData: HelpItem[] = [
  {
    question: "Game bị lag / FPS thấp",
    answer:
      "Tắt tab dư thừa, cập nhật driver GPU, dùng Chrome hoặc Edge.",
  },
];
