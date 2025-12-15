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
          {slots.map((item, idx) => (
            <div
              key={item ? item.id : `empty-${idx}`}
              className={`
                aspect-square border-2 flex items-center justify-center text-2xl relative group
                ${
                  item
                    ? selectedItem?.id === item.id
                      ? "bg-zinc-700 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      : "bg-zinc-800 border-zinc-500 cursor-pointer hover:border-amber-400 hover:bg-zinc-700"
                    : "bg-zinc-900/50 border-zinc-800"
                }
              `}
              onClick={() => item && setSelectedItem(item)}
              title={item ? item.name : undefined}
            >
              {item ? (
                <>
                  <span>{item.icon}</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border border-white text-white text-[10px] p-2 whitespace-nowrap z-50 font-pixel">
                    {item.name}
                  </div>
                </>
              ) : null}
            </div>
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
            <div className="text-xs text-zinc-500 text-center mt-2 font-pixel">
              Kéo thả hoặc nhấn đúp để sử dụng vật phẩm.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

