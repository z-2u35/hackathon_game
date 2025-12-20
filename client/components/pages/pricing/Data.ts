export interface PricingTable {
  headers: string[];
  rows: string[][];
}

export interface PricingSection {
  id: string;
  title: string;
  description?: string;
  tables: PricingTable[];
}

export const pricingData: PricingSection[] = [
  {
    id: "nft-value",
    title: "I. Giá Trị Của Vật Phẩm (NFT Value)",
    description:
      "Giá trị NFT được quyết định bởi độ hiếm, trạng thái và cái giá mà người chơi sẵn sàng trả bằng lý trí.",
    tables: [
      {
        headers: ["Độ hiếm", "Drop Rate", "Đặc điểm", "Tác động"],
        rows: [
          ["Common", "50%", "Chỉ số trung bình", "Hồi phục Sanity/HP cơ bản"],
          ["Rare", "30%", "Có thể gắn 1 Upgrade", "Cần thiết để đi sâu hầm ngục"],
          ["Epic", "15%", "2 Upgrade", "Giá trị giao dịch cao"],
          ["Legendary", "4%", "Chỉ số đặc biệt", "Ảnh hưởng True Ending"],
          ["Cursed", "1%", "Sức mạnh cực đoan", "Trừ Sanity theo thời gian"],
        ],
      },
    ],
  },

  {
    id: "marketplace",
    title: "II. Giao Dịch & Phí",
    tables: [
      {
        headers: ["Cơ chế", "Mô tả", "Đánh đổi"],
        rows: [
          ["Kiosk Marketplace", "Giao dịch P2P trên Sui", "5% Royalty + Gas"],
          ["Memory Pool", "Burn NFT nhận NFT ngẫu nhiên", "Không phí, mang lời nguyền"],
        ],
      },
    ],
  },

  {
    id: "resources",
    title: "III. Trao Đổi Tài Nguyên",
    tables: [
      {
        headers: ["Tài nguyên", "Thu thập", "Sử dụng", "Giá trị"],
        rows: [
          ["Memory Shards", "Drop / Hòm", "Mua vật phẩm, hồi Sanity", "Tiền tệ tinh thần"],
          ["HP", "Chỉ số sống", "Đổi trực tiếp với Merchant", "Thân xác đổi lợi ích"],
          ["Oil", "Tìm / Mua", "Duy trì ánh sáng", "Thiết yếu tuyệt đối"],
          ["Soulbound Scars", "Game Over", "Lore / Leaderboard", "Danh tiếng vĩnh viễn"],
        ],
      },
    ],
  },
];
