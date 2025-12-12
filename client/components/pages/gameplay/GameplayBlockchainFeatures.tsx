"use client";

export default function BlockchainFeatures() {
  const features = [
    { name: "zkLogin", desc: "Đăng nhập bằng Google / FB, Ví Sui" },
    { name: "Dynamic NFT", desc: "Vật phẩm thay đổi hình dạng theo stats, nâng cấp/sửa chữa" },
    { name: "Shared Object", desc: "Trao đổi vật phẩm gián tiếp, core mechanic game" },
  ];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">🔗 6. Tính Năng Blockchain Tích Hợp</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.name} className="bg-zinc-700/80 p-4 rounded-lg border border-amber-300/30">
            <h3 className="font-bold">{feature.name}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
