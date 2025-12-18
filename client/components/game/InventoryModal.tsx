"use client";

import { useState } from "react";

export type ItemRarity = "common" | "rare" | "epic" | "legendary" | "cursed";

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: "consumable" | "key" | "weapon" | "tool";
  rarity?: ItemRarity;
  effect?: {
    hp?: number;
    oil?: number;
    sanity?: number;
  };
}

// Rarity color mapping
export const RARITY_COLORS: Record<ItemRarity, { border: string; bg: string; text: string; glow: string }> = {
  common: {
    border: "border-zinc-500",
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    glow: "shadow-[0_0_5px_rgba(161,161,170,0.3)]",
  },
  rare: {
    border: "border-blue-500",
    bg: "bg-blue-900/30",
    text: "text-blue-300",
    glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
  },
  epic: {
    border: "border-purple-500",
    bg: "bg-purple-900/30",
    text: "text-purple-300",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.6)]",
  },
  legendary: {
    border: "border-amber-500",
    bg: "bg-amber-900/30",
    text: "text-amber-300",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.8)]",
  },
  cursed: {
    border: "border-red-800",
    bg: "bg-red-900/40",
    text: "text-red-400",
    glow: "shadow-[0_0_15px_rgba(127,29,29,0.6)]",
  },
};

interface InventoryModalProps {
  items: GameItem[];
  onClose: () => void;
  onUse: (item: GameItem) => void;
  onDrop?: (item: GameItem) => void;
}

export default function InventoryModal({
  items,
  onClose,
  onUse,
  onDrop,
}: InventoryModalProps) {
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);

  // Tạo grid 5x4 (20 slots) như yêu cầu
  const totalSlots = 20;
  const slots = [...items, ...Array(Math.max(0, totalSlots - items.length)).fill(null)];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border-4 border-zinc-600 w-[600px] p-1 shadow-2xl font-pixel text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-zinc-800 p-2 border-b-4 border-zinc-700 flex justify-between items-center mb-4">
          <h3 className="text-white text-lg ml-2 font-pixel">🎒 HÀNH TRANG</h3>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-200 text-xl font-bold px-3 transition-colors"
          >
            X
          </button>
        </div>

        {/* Cột trái: Lưới đồ - Grid 5x4 */}
        <div className="flex-1 grid grid-cols-5 gap-2 p-4 bg-black/40 h-[300px] overflow-y-auto content-start mt-12">
          {slots.map((item, idx) => {
            const rarity: ItemRarity = (item?.rarity || "common") as ItemRarity;
            const rarityStyle = RARITY_COLORS[rarity];
            const isSelected = selectedItem?.id === item?.id;

            return (
              <div
                key={item ? item.id : `empty-${idx}`}
                className={`
                  aspect-square border-2 flex items-center justify-center text-2xl relative group
                  ${
                    item
                      ? isSelected
                        ? `${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow}`
                        : `${rarityStyle.bg} ${rarityStyle.border} cursor-pointer hover:${rarityStyle.border} hover:${rarityStyle.glow}`
                      : "bg-zinc-900/50 border-zinc-800"
                  }
                  transition-all
                `}
                onClick={() => item && setSelectedItem(item)}
                title={item ? item.name : undefined}
              >
                {item ? (
                  <>
                    <span className={rarityStyle.text}>{item.icon}</span>
                    {/* Rarity indicator - small dot */}
                    <div
                      className={`absolute top-1 right-1 w-2 h-2 rounded-full ${rarityStyle.border.replace("border-", "bg-")}`}
                    />
                    {/* Tooltip với rarity */}
                    <div
                      className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border ${rarityStyle.border} ${rarityStyle.text} text-[10px] p-2 whitespace-nowrap z-50 font-pixel ${rarityStyle.glow}`}
                    >
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[8px] text-zinc-500 uppercase mt-0.5">
                        {rarity}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Cột phải: Chi tiết */}
        <div className="w-1/3 border-l-2 border-zinc-600 pl-4 flex flex-col mt-12">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-xl font-pixel ${
                    RARITY_COLORS[selectedItem.rarity || "common"].text
                  }`}
                >
                  {selectedItem.name}
                </h3>
                <span
                  className={`text-[10px] uppercase font-pixel px-2 py-1 border ${
                    RARITY_COLORS[selectedItem.rarity || "common"].border
                  } ${RARITY_COLORS[selectedItem.rarity || "common"].bg}`}
                >
                  {selectedItem.rarity || "common"}
                </span>
              </div>
              <div className="text-4xl mb-3">{selectedItem.icon}</div>
              <p className="text-sm text-zinc-400 mb-4 flex-1 leading-relaxed font-pixel">
                {selectedItem.description}
              </p>

              {/* Effect info */}
              {selectedItem.effect && (
                <div className="mb-4 space-y-1">
                  <div className="text-xs text-zinc-500 font-pixel">HIỆU ỨNG:</div>
                  {selectedItem.effect.hp && (
                    <div className="text-sm text-red-400">
                      HP: {selectedItem.effect.hp > 0 ? "+" : ""}
                      {selectedItem.effect.hp}
                    </div>
                  )}
                  {selectedItem.effect.oil && (
                    <div className="text-sm text-amber-400">
                      Oil: {selectedItem.effect.oil > 0 ? "+" : ""}
                      {selectedItem.effect.oil}
                    </div>
                  )}
                  {selectedItem.effect.sanity && (
                    <div className="text-sm text-purple-400">
                      Sanity: {selectedItem.effect.sanity > 0 ? "+" : ""}
                      {selectedItem.effect.sanity}
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2">
                {selectedItem.type === "consumable" && (
                  <button
                    onClick={() => {
                      onUse(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="w-full bg-green-900 hover:bg-green-800 py-2 border-2 border-green-600 text-white font-pixel transition-all active:translate-y-0.5"
                  >
                    SỬ DỤNG
                  </button>
                )}
                {onDrop && (
                  <button
                    onClick={() => {
                      onDrop(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="w-full bg-red-900 hover:bg-red-800 py-2 border-2 border-red-600 text-white font-pixel transition-all active:translate-y-0.5"
                  >
                    VỨT BỎ
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-zinc-500 text-center font-pixel">
                Chọn một vật phẩm để xem chi tiết...
              </p>
            </div>
          )}

          {/* Footer - Currency */}
          <div className="mt-auto pt-4 border-t border-zinc-600">
            <div className="text-sm text-amber-400 font-pixel">
              Vàng: <span className="text-white">100</span>
            </div>
            <div className="text-xs text-zinc-500 text-center mt-2 font-pixel">
              Kéo thả hoặc nhấn đúp để sử dụng vật phẩm.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

