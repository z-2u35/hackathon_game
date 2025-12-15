// components/pages/privacy/privacyData.ts
export type PrivacyItem = {
  title: string;
  contents: string[];
};

export type PrivacySectionData = {
  id: string;
  title: string;
  items: PrivacyItem[];
};

export const privacyData: PrivacySectionData[] = [
  {
    id: "user-rights",
    title: "I. QUYỀN LỢI NGƯỜI CHƠI",
    items: [
      {
        title: "True Ownership",
        contents: [
          "Người chơi toàn quyền sở hữu NFT trong ví.",
          "NPH không thể tịch thu NFT (trừ hack/bug theo Smart Contract).",
        ],
      },
      {
        title: "Privacy",
        contents: [
          "Chỉ thu thập dữ liệu on-chain và email dạng hash.",
          "Không thu thập thông tin cá nhân nhạy cảm.",
        ],
      },
    ],
  },
  {
    id: "publisher-rights",
    title: "II. QUYỀN HẠN NHÀ PHÁT HÀNH",
    items: [
      {
        title: "Game Balancing",
        contents: [
          "NPH có quyền điều chỉnh chỉ số vật phẩm để cân bằng game.",
        ],
      },
      {
        title: "Access Control",
        contents: [
          "Ban các ví sử dụng bot, cheat hoặc khai thác lỗi.",
        ],
      },
    ],
  },
  {
    id: "disclaimer",
    title: "III. MIỄN TRỪ TRÁCH NHIỆM",
    items: [
      {
        title: "Rủi ro & trách nhiệm",
        contents: [
          "Giá trị NFT do thị trường quyết định.",
          "Lộ private key hoặc email là trách nhiệm người chơi.",
          "Yêu cầu đủ 18 tuổi để tham gia kinh tế NFT.",
        ],
      },
    ],
  },
];
