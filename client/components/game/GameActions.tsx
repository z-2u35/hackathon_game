"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/app/networkConfig";

interface GameActionsProps {
  lanternId: string;
  onSuccess: () => void; // Hàm callback để reload lại HUD sau khi đi xong
}

export default function GameActions({ lanternId, onSuccess }: GameActionsProps) {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMove = () => {
    const tx = new Transaction();

    // Gọi hàm 'move_room' trong contract lantern
    tx.moveCall({
      target: `${packageId}::lantern::move_room`, 
      arguments: [tx.object(lanternId)],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("Di chuyển thành công:", result);
          alert("👣 Đã bước sang phòng mới! (Mất 10 Dầu)");
          onSuccess(); // Gọi hàm này để HUD tự cập nhật lại lượng dầu mới
        },
        onError: (err) => {
          console.error("Lỗi:", err);
          alert("Không thể di chuyển: " + err.message);
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-6">
      
      {/* Nút DI CHUYỂN */}
      <button
        onClick={handleMove}
        className="font-pixel text-lg bg-zinc-800 hover:bg-zinc-700 text-white py-4 px-6 rounded border-2 border-zinc-600 hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2 group"
      >
        <span>🕯️</span>
        TIẾN VÀO BÓNG TỐI
        <span className="text-xs text-zinc-500 group-hover:text-amber-600">(-10 Oil)</span>
      </button>
      
    </div>
  );
}