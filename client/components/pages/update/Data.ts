export interface UpdateEntry {
  version: string;
  date: string;
  title: string;
  sections: {
    heading: string;
    items: string[];
  }[];
}

export const updateData: UpdateEntry[] = [
  {
    version: "v0.3.0",
    date: "Cycle 47 — Asteros",
    title: "The Merchant Awakens",
    sections: [
      {
        heading: "Gameplay",
        items: [
          "Thêm The Merchant of Whispers với cơ chế giao dịch bằng HP và Memory Shards.",
          "Giới thiệu tài nguyên Oil – ánh sáng giờ đây là điều kiện sống còn.",
          "Cursed Items bắt đầu làm giảm Sanity theo thời gian.",
        ],
      },
      {
        heading: "Economy / NFT",
        items: [
          "Triển khai Dynamic NFT: giá trị thay đổi theo độ bền và trạng thái.",
          "Kích hoạt Kiosk Marketplace (P2P trading).",
          "Áp dụng Royalty 5% cho mọi giao dịch NFT.",
        ],
      },
      {
        heading: "Lore",
        items: [
          "Mỗi giao dịch để lại một vết sẹo trong ký ức nhân vật.",
          "Hé lộ vai trò thật sự của The Merchant trong vòng lặp Asteros.",
        ],
      },
    ],
  },

  {
    version: "v0.2.1",
    date: "Cycle 31 — Asteros",
    title: "Memory Has Weight",
    sections: [
      {
        heading: "Balance",
        items: [
          "Giảm drop rate Legendary từ 6% xuống 4%.",
          "Tăng giá trị hồi Sanity của Memory Shards.",
        ],
      },
      {
        heading: "UI / UX",
        items: [
          "Cải thiện hiển thị bảng giao dịch trong Kiosk.",
          "Thêm cảnh báo khi Sanity xuống mức nguy hiểm.",
        ],
      },
    ],
  },

  {
    version: "v0.2.0",
    date: "Cycle 18 — Asteros",
    title: "The First Scar",
    sections: [
      {
        heading: "Core Systems",
        items: [
          "Ra mắt hệ thống Sanity.",
          "Soulbound Scars được ghi nhận vĩnh viễn sau mỗi lần Game Over.",
        ],
      },
    ],
  },
];
