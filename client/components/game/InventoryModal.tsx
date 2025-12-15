"use client";

import { useState } from "react";

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: "consumable" | "key" | "weapon" | "tool";
  effect?: {
    hp?: number;
    oil?: number;
    sanity?: number;
  };
}

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

  // Tạo grid 4x4 (16 slots)
  const gridSize = 16;
  const emptySlots = gridSize - items.length;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-800 border-4 border-zinc-500 w-[700px] h-[500px] p-6 flex gap-6 shadow-2xl font-pixel text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-red-900 hover:bg-red-800 border-2 border-red-600 flex items-center justify-center text-red-200 font-bold transition-all"
        >
          ✕
        </button>

        {/* Header */}
        <div className="absolute top-4 left-6 right-6 border-b-2 border-zinc-600 pb-2">
          <h2 className="text-2xl text-amber-400 font-pixel">HÀNH TRANG</h2>
        </div>

        {/* Cột trái: Lưới đồ */}
        <div className="flex-1 grid grid-cols-4 gap-2 content-start mt-12">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`aspect-square bg-black border-2 ${
                selectedItem?.id === item.id
                  ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  : "border-zinc-600 hover:border-amber-500"
              } cursor-pointer flex items-center justify-center transition-all relative group`}
              onClick={() => setSelectedItem(item)}
              title={item.name}
            >
              <span className="text-3xl">{item.icon}</span>
              {/* Quantity indicator nếu có */}
              {item.type === "consumable" && (
                <span className="absolute bottom-0 right-0 bg-amber-600 text-black text-[10px] px-1 font-bold">
                  1
                </span>
              )}
            </div>
          ))}
          {/* Tạo ô trống */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-black/50 border border-zinc-700 opacity-50"
            />
          ))}
        </div>

        {/* Cột phải: Chi tiết */}
        <div className="w-1/3 border-l-2 border-zinc-600 pl-4 flex flex-col mt-12">
          {selectedItem ? (
            <>
              <h3 className="text-xl text-amber-500 mb-2 font-pixel">
                {selectedItem.name}
              </h3>
              <div className="text-4xl mb-3">{selectedItem.icon}</div>
              <p className="text-sm text-zinc-400 mb-4 flex-1 leading-relaxed">
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
          </div>
        </div>
      </div>
    </div>
  );
}

