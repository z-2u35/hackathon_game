"use client";

import { useMintLantern } from "@/hook/useMintLantern";

export default function StartGameButton() {
  const { handleMint } = useMintLantern();

  const handleStartGame = () => {
    handleMint();
  };

    return (
      <button
        onClick={handleStartGame}
        className="font-pixel text-xl m-3 cursor-pointer bg-amber-600 hover:bg-amber-500 text-white py-4 px-8 rounded border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all shadow-[0_0_20px_rgba(217,119,6,0.5)]"
      >
        KHỞI TẠO HÀNH TRÌNH (MINT)
      </button>
    );
  }