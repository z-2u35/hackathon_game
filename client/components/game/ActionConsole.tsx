"use client";

import { addGameLog } from "./ActionLog";

interface ActionConsoleProps {
  onMove?: () => void;
  onRest?: () => void;
  onSearch?: () => void;
  onAttack?: () => void;
  onFocusLight?: () => void;
  onWhisper?: () => void;
  canMove?: boolean;
  oil?: number;
  sanity?: number;
}

export default function ActionConsole({
  onMove,
  onRest,
  onSearch,
  onAttack,
  onFocusLight,
  onWhisper,
  canMove = true,
  oil = 100,
  sanity = 100,
}: ActionConsoleProps) {
  const handleAction = (action: string, callback?: () => void) => {
    if (callback) {
      callback();
    }
  };

  return (
    <div className="absolute bottom-4 right-4 pointer-events-auto z-30">
      <div className="bg-black/85 border-2 border-zinc-600 p-3 shadow-2xl font-pixel min-w-[260px] max-w-[300px] backdrop-blur-sm">
        {/* Header */}
        <div className="border-b-2 border-zinc-700 pb-2 mb-3">
          <h3 className="text-amber-400 text-sm font-pixel uppercase">Bảng Điều Khiển</h3>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Move */}
          <button
            onClick={() => handleAction("Di chuyển", onMove)}
            disabled={!canMove}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
          >
            👣 Di chuyển
          </button>

          {/* Rest */}
          <button
            onClick={() => handleAction("Nghỉ ngơi", onRest)}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-green-500 py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
          >
            😴 Nghỉ ngơi
          </button>

          {/* Search */}
          <button
            onClick={() => handleAction("Tìm kiếm", onSearch)}
            className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-blue-500 py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
          >
            🔍 Tìm kiếm
          </button>

          {/* Attack */}
          {onAttack && (
            <button
              onClick={() => handleAction("Tấn công", onAttack)}
              className="bg-red-900 hover:bg-red-800 border-2 border-red-600 hover:border-red-400 py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
            >
              ⚔️ Tấn công
            </button>
          )}
        </div>

        {/* Special Actions */}
        {(onFocusLight || onWhisper) && (
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {onFocusLight && (
              <button
                onClick={() => handleAction("Làm choáng", onFocusLight)}
                disabled={oil < 10}
                className="bg-amber-900 hover:bg-amber-800 border-2 border-amber-600 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
              >
                💡 Làm choáng
              </button>
            )}
            {onWhisper && (
              <button
                onClick={() => handleAction("Dùng Memory Shard", onWhisper)}
                disabled={sanity < 20}
                className="bg-purple-900 hover:bg-purple-800 border-2 border-purple-600 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 px-2 text-[10px] font-pixel transition-all active:scale-95"
              >
                💬 Memory Shard
              </button>
            )}
          </div>
        )}

        {/* Status Info */}
        <div className="bg-black/60 border-2 border-zinc-700 p-2">
          <div className="text-[10px] text-zinc-400 font-pixel space-y-1">
            <div className="flex justify-between">
              <span>Dầu:</span>
              <span className={oil < 20 ? "text-red-400" : "text-amber-400"}>{oil}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Tinh thần:</span>
              <span className={sanity < 50 ? "text-purple-400" : "text-purple-300"}>{sanity}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

