"use client";

import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";
import { useMintLantern } from "@/hook/useMintLantern";

export default function StartGameButton() {
  const packageId = useNetworkVariable("packageId");
  const { hasGas } = useHasGas();
  const { handleMint } = useMintLantern();

  const handleStartGame = () => {
    if (!packageId) {
      alert("Package ID chưa có, không thể mint lantern.");
      return;
    }
    handleMint();
  };

  return (
    <button
      onClick={handleStartGame}
      disabled={!hasGas}
      className="font-pixel text-xl m-3 cursor-pointer bg-amber-600 hover:bg-amber-500 text-white py-4 px-8 rounded border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all shadow-[0_0_20px_rgba(217,119,6,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
      title={!hasGas ? "Bạn chưa có SUI để trả gas trên network hiện tại." : undefined}
    >
      KHỞI TẠO HÀNH TRÌNH (MINT)
    </button>
  );
}
