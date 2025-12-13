"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface GameActionsProps {
  lanternId: string;
  onSuccess: () => void; // Callback để reload HUD sau khi đi xong
}

export default function GameActions({ lanternId, onSuccess }: GameActionsProps) {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const network = useNetworkVariable ? useNetworkVariable("url") : getFullnodeUrl("testnet");
  const suiClient = new SuiClient({ url: network });

  const handleMove = async () => {
    if (!account?.address) {
      alert("Không tìm thấy địa chỉ ví.");
      return;
    }
    // Kiểm tra số dư SUI
    try {
      const balance = await suiClient.getBalance({ owner: account.address, coinType: "0x2::sui::SUI" });
      const suiBalance = Number(balance.totalBalance) / 1e9; // SUI = 10^9 MIST
      if (suiBalance < 0.01) {
        alert("Ví của bạn không đủ SUI để làm phí gas. Hãy nhận thêm SUI từ faucet testnet!");
        return;
      }
    } catch (e) {
      alert("Không kiểm tra được số dư SUI. Vui lòng thử lại.");
      return;
    }
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
          onSuccess(); // Reload HUD
        },
        onError: (err: unknown) => {
          console.error("Lỗi:", err);
          // Kiểm tra kiểu trước khi truy cập message
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Unknown error";
          alert("Không thể di chuyển: " + message);
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-6 **:font-pixel">
      {/* Nút DI CHUYỂN */}
      <button
        onClick={handleMove}
        className="text-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white py-4 px-6 rounded border-2 border-zinc-600 hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2"
      >
        <span>🕯️</span>
        TIẾN VÀO BÓNG TỐI
        <span className="text-xs text-zinc-500 group-hover:text-amber-600">(-10 Oil)</span>
      </button>
    </div>
  );
}
