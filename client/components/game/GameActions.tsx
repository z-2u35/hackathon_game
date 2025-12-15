"use client";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";
import { useMintLantern } from "@/hook/useMintLantern";
import ButtonParticleEffect from "./ButtonParticleEffect";

interface GameActionsProps {
  lanternId: string;
  oil?: number;
  isAlive?: boolean;
  onSuccess: () => void;
  onAddLog?: (msg: string) => void; // Thêm prop để bắn log
}

export default function GameActions({ lanternId, oil, isAlive, onSuccess, onAddLog }: GameActionsProps) {
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
    if (onAddLog) {
      onAddLog('<span class="text-yellow-400">👣 Tính năng di chuyển đang được phát triển...</span>');
    } else {
      alert("👣 Tính năng di chuyển đang được phát triển. Vui lòng chơi game story mode tại /game");
    }
    
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
        if (onAddLog) {
          onAddLog('<span class="text-green-400">🔄 Đã reset Oil (mint Lantern mới).</span>');
        } else {
          alert("🔄 Đã reset Oil (mint Lantern mới). ");
        }
        onSuccess();
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-6 **:font-pixel">
      <button
        id="move-button"
        onClick={handleMove}
        disabled={!canMove || !hasGas}
        className="relative text-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white py-4 px-6 rounded border-2 border-zinc-600 hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <ButtonParticleEffect 
          buttonId="move-button" 
          color={0xffb94a}
          enabled={canMove && hasGas}
        />
        <span className="relative z-10">🕯️</span>
        <span className="relative z-10">TIẾN VÀO BÓNG TỐI</span>
        <span className="text-xs text-zinc-500 group-hover:text-amber-600 relative z-10">(-10 Oil)</span>
      </button>

      <button
        id="reset-button"
        onClick={handleResetOil}
        disabled={!hasGas}
        className="relative text-lg cursor-pointer bg-amber-700 hover:bg-amber-600 text-white py-4 px-6 rounded border-2 border-amber-900 transition-all shadow-lg active:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <ButtonParticleEffect 
          buttonId="reset-button" 
          color={0xff9500}
          enabled={hasGas}
        />
        <span className="relative z-10">🔄</span>
        <span className="relative z-10">RESET OIL (MINT MỚI)</span>
        <span className="text-xs text-amber-200/80 relative z-10">(oil=100)</span>
      </button>
    </div>
  );
}
