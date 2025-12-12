"use client";

export default function DungeonRooms() {
  const rooms = [
    "Mirror Hallway – Ảo ảnh phản chiếu",
    "Echo Beast – Tiếng bước chân đi sau bạn",
    "Twin Doors – Sanity quyết định text thật hay lừa",
    "Memory Pool – Burn 1 NFT → nhận NFT khác",
    "Throne Room – Đối mặt với “bạn” lần chơi trước",
  ];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">🏛 4. Khám Phá 5 Phòng Nguy Hiểm</h2>
      <ul className="list-disc list-inside space-y-2">
        {rooms.map((room, idx) => (
          <li key={idx}>{room}</li>
        ))}
      </ul>
    </div>
  );
}
