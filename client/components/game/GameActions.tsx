"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";
import { useMintLantern } from "@/hook/useMintLantern";

interface GameActionsProps {
  lanternId: string;
  oil?: number;
  isAlive?: boolean;
  onSuccess: () => void;
}

export default function GameActions({ lanternId, oil, isAlive, onSuccess }: GameActionsProps) {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { hasGas } = useHasGas();
  const { handleMint } = useMintLantern();

  const canMove = Boolean(lanternId) && isAlive !== false && (oil ?? 1) > 0;

  const handleMove = () => {
    if (!hasGas) {
      const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
      alert(`Bạn không có SUI gas trên ${network}. Hãy faucet SUI (đúng network) rồi thử lại.`);
      return;
    }

    if (!canMove) {
      const reason =
        isAlive === false
          ? "Lantern đã chết. Hãy Reset Oil (mint mới) để chơi lại."
          : (oil ?? 0) <= 0
            ? "Lantern đã cạn Oil. Hãy Reset Oil (mint mới) để chơi lại."
            : "Không thể di chuyển.";
      alert(reason);
      return;
    }

    // TODO: Function move_room chưa được implement trong smart contract
    // Tạm thời chỉ hiển thị thông báo, không gọi blockchain
    alert("👣 Tính năng di chuyển đang được phát triển. Vui lòng chơi game story mode tại /game");
    
    // Code cũ - sẽ được enable khi smart contract có function move_room
    /*
    const tx = new Transaction();
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
          onSuccess();
        },
        onError: (err: unknown) => {
          console.error("Lỗi:", err);
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Unknown error";
          alert("Không thể di chuyển: " + message);
        },
      }
    );
    */
  };

  const handleResetOil = () => {
    handleMint({
      onSuccess: () => {
        alert("🔄 Đã reset Oil (mint Lantern mới). ");
        onSuccess();
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-6 **:font-pixel">
      <button
        onClick={handleMove}
        disabled={!canMove || !hasGas}
        className="text-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white py-4 px-6 rounded border-2 border-zinc-600 hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>🕯️</span>
        TIẾN VÀO BÓNG TỐI
        <span className="text-xs text-zinc-500 group-hover:text-amber-600">(-10 Oil)</span>
      </button>

      <button
        onClick={handleResetOil}
        disabled={!hasGas}
        className="text-lg cursor-pointer bg-amber-700 hover:bg-amber-600 text-white py-4 px-6 rounded border-2 border-amber-900 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>🔄</span>
        RESET OIL (MINT MỚI)
        <span className="text-xs text-amber-200/80">(oil=100)</span>
      </button>
    </div>
  );
}
