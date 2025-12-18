"use client";

import { useEffect, useState } from "react";

interface ItemNotificationPopupProps {
  item: {
    name: string;
    icon?: string;
    description?: string;
    rarity?: "common" | "rare" | "epic" | "legendary" | "cursed";
  } | null;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: "text-gray-400 border-gray-600",
  rare: "text-blue-400 border-blue-600",
  epic: "text-purple-400 border-purple-600",
  legendary: "text-amber-400 border-amber-600",
  cursed: "text-red-400 border-red-600",
};

const RARITY_GLOW = {
  common: "shadow-[0_0_10px_rgba(156,163,175,0.3)]",
  rare: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  epic: "shadow-[0_0_20px_rgba(168,85,247,0.6)]",
  legendary: "shadow-[0_0_25px_rgba(245,158,11,0.8)]",
  cursed: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
};

export default function ItemNotificationPopup({ item, onClose }: ItemNotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (item) {
      setIsVisible(true);
      setIsLeaving(false);
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [item, onClose]);

  if (!item || !isVisible) return null;

  const rarity = item.rarity || "common";
  const rarityColor = RARITY_COLORS[rarity];
  const rarityGlow = RARITY_GLOW[rarity];

  return (
    <div
      className={`fixed top-20 right-4 z-[60] pointer-events-none item-popup-${
        isLeaving ? "out" : "in"
      }`}
      style={{ width: '280px' }}
    >
      <div
        className={`bg-black/98 border-4 ${rarityColor} ${rarityGlow} pixel-border p-4 backdrop-blur-sm`}
        style={{
          borderImageSlice: 'fill',
          imageRendering: 'pixelated',
        }}
      >
        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-4xl mb-1 pixel-text" style={{ imageRendering: 'pixelated' }}>
            {item.icon || "📦"}
          </div>
          <div className="text-[10px] text-zinc-400 font-pixel uppercase tracking-wider mb-1">
            ĐÃ NHẶT ĐƯỢC
          </div>
        </div>

        {/* Item Name */}
        <div className={`text-center mb-2 ${rarityColor}`}>
          <h3 className="text-lg font-pixel font-bold pixel-text">{item.name}</h3>
        </div>

        {/* Description */}
        {item.description && (
          <div className="text-center text-[10px] text-zinc-400 font-pixel mb-3 border-t-2 border-zinc-800 pt-2 leading-tight">
            {item.description}
          </div>
        )}

        {/* Rarity Badge */}
        <div className="text-center">
          <span
            className={`inline-block px-2 py-1 text-[10px] font-pixel uppercase border-2 ${rarityColor} pixel-border`}
          >
            {rarity === "common" && "Thường"}
            {rarity === "rare" && "Hiếm"}
            {rarity === "epic" && "Cực Hiếm"}
            {rarity === "legendary" && "Huyền Thoại"}
            {rarity === "cursed" && "Bị Nguyền Rủa"}
          </span>
        </div>

        {/* Sparkle effect - pixelated */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white animate-ping pixel-text"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeOutSlide {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .item-popup-in {
          animation: fadeInSlide 0.3s ease-out;
        }

        .item-popup-out {
          animation: fadeOutSlide 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}

