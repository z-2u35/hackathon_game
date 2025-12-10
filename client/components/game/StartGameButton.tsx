"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
// --- SỬA DÒNG NÀY ---
// Import từ file cấu hình của bạn, KHÔNG PHẢI từ @mysten/dapp-kit
import { useNetworkVariable } from "@/app/providers/networkConfig"; 

export default function StartGameButton() {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleStartGame = () => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${packageId}::lantern::new_game`,
      arguments: [],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("Success:", result);
          alert("🎮 ĐÃ MINT THÀNH CÔNG! Kiểm tra ví của bạn.");
        },
        onError: (err) => {
          console.error("Error:", err);
          alert("Lỗi: " + err.message);
        },
      }
    );
  };

  return (
    <button
      onClick={handleStartGame}
      className="font-pixel text-xl bg-amber-600 hover:bg-amber-500 text-white py-4 px-8 rounded border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all shadow-[0_0_20px_rgba(217,119,6,0.5)]"
    >
      KHỞI TẠO HÀNH TRÌNH (MINT)
    </button>
  );
}