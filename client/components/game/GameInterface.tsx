"use client";

import { useState } from "react";
import GameHUD from "./GameHUD";
import InventoryModal, { GameItem } from "./InventoryModal";
import GameActions from "./GameActions";
import { addGameLog } from "./ActionLog";
import { usePlayerStats } from "@/hook/usePlayerStats";

interface GameInterfaceProps {
  stats?: {
    oil: number;
    sanity: number;
    stage: number;
    health?: number;
  };
  inventory?: GameItem[];
  lanternId?: string;
  onRefresh?: () => void;
  children?: React.ReactNode; // Isometric game canvas
}

export default function GameInterface({
  stats,
  inventory = [],
  lanternId: propLanternId,
  onRefresh,
  children,
}: GameInterfaceProps) {
  const [isInvOpen, setInvOpen] = useState(false);
  const playerStats = usePlayerStats();
  
  // Sử dụng props nếu có, không thì lấy từ hook
  const lanternId = propLanternId ?? playerStats.lanternObjects[0]?.data?.objectId ?? "";
  const currentOil = stats?.oil ?? playerStats.oil ?? 0;
  const currentHealth = stats?.health ?? playerStats.hp ?? 100;
  const currentSanity = stats?.sanity ?? playerStats.sanity ?? 0;

  // Mock inventory nếu chưa có
  const defaultInventory: GameItem[] = inventory.length > 0 ? inventory : [];

  const addLog = (msg: string) => {
    addGameLog(msg, "info");
  };

  const handleMove = () => {
    addLog('<span class="text-yellow-400">Bạn đang di chuyển...</span>');
    // TODO: Implement move logic
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
      {/* 1. HUD (Góc trái trên) */}
      <GameHUD
        oil={currentOil}
        health={currentHealth}
        sanity={currentSanity}
        lanternId={lanternId}
      />

      {/* 2. LOG HÀNH ĐỘNG (Giữa màn hình dưới) */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[500px] text-center pointer-events-none z-30">
        <div className="flex flex-col-reverse gap-1">
          {/* Log sẽ được render bởi ActionLog component */}
        </div>
      </div>

      {/* 3. Isometric Game Canvas - Lớp dưới cùng */}
      {children && (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          {children}
        </div>
      )}

      {/* 4. INVENTORY MODAL */}
      {isInvOpen && (
        <div className="pointer-events-auto z-50">
          <InventoryModal
            items={defaultInventory}
            onClose={() => setInvOpen(false)}
            onUse={(item) => {
              addLog(`<span class="text-green-400">Đã sử dụng: ${item.name}</span>`);
              setInvOpen(false);
            }}
            onDrop={(item) => {
              addLog(`<span class="text-red-400">Đã vứt: ${item.name}</span>`);
              setInvOpen(false);
            }}
          />
        </div>
      )}

      {/* 5. ACTION BAR (Thanh điều khiển dưới cùng) */}
      <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-6 pb-8 flex items-end justify-center gap-4 pointer-events-auto z-30">
        {/* Nút Mở Túi */}
        <button
          onClick={() => setInvOpen(true)}
          className="h-14 w-14 bg-zinc-800 border-2 border-zinc-500 rounded hover:bg-zinc-700 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center relative group"
        >
          <span className="text-2xl">🎒</span>
          {defaultInventory.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-pixel">
              {defaultInventory.length}
            </span>
          )}
        </button>

        {/* Các nút hành động chính */}
        <div className="flex-1 max-w-md">
          <GameActions
            lanternId={lanternId}
            oil={currentOil}
            isAlive={playerStats.isAlive}
            onSuccess={() => {
              if (onRefresh) onRefresh();
              else playerStats.refetch();
            }}
            onAddLog={addLog}
          />
        </div>

        {/* Nút Menu/Cài đặt */}
        <button className="h-14 w-14 bg-zinc-800 border-2 border-zinc-500 rounded hover:bg-zinc-700 active:scale-95 flex items-center justify-center transition-all">
          ⚙️
        </button>
      </div>
    </div>
  );
}
