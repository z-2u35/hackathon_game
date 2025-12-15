"use client";

interface ActionButtonsProps {
  onMove: () => void;
  onAttack?: () => void;
  onInteract?: () => void;
  onInventory: () => void;
  canMove?: boolean;
  disabled?: boolean;
}

export default function ActionButtons({
  onMove,
  onAttack,
  onInteract,
  onInventory,
  canMove = true,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex gap-3 pointer-events-auto z-30">
      {/* Attack/Interact Button */}
      {(onAttack || onInteract) && (
        <button
          onClick={onAttack || onInteract}
          disabled={disabled}
          className="w-16 h-16 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-red-500 flex items-center justify-center text-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-pixel"
          title={onAttack ? "Tấn công" : "Tương tác"}
        >
          {onAttack ? "🗡️" : "👋"}
        </button>
      )}

      {/* Inventory Button */}
      <button
        onClick={onInventory}
        className="w-16 h-16 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-amber-500 flex items-center justify-center text-2xl transition-all shadow-lg active:scale-95 font-pixel"
        title="Túi đồ"
      >
        🎒
      </button>

      {/* Move Button - Lớn nhất */}
      <button
        onClick={onMove}
        disabled={!canMove || disabled}
        className="w-20 h-20 bg-amber-700 hover:bg-amber-600 border-4 border-amber-900 hover:border-amber-800 flex items-center justify-center text-3xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-pixel relative"
        title="Di chuyển"
      >
        👣
        {!canMove && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}

