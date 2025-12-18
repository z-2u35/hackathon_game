"use client";

import { useEffect, useState } from "react";

interface StoryEventPopupProps {
  event: {
    title: string;
    description: string;
    icon?: string;
    effect?: string; // e.g., "+5 Sanity", "-10 Oil"
    type?: "info" | "warning" | "success" | "error" | "story";
  } | null;
  onClose: () => void;
}

const TYPE_COLORS = {
  info: "text-blue-400 border-blue-600",
  warning: "text-yellow-400 border-yellow-600",
  success: "text-green-400 border-green-600",
  error: "text-red-400 border-red-600",
  story: "text-purple-400 border-purple-600",
};

const TYPE_GLOW = {
  info: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  warning: "shadow-[0_0_15px_rgba(234,179,8,0.5)]",
  success: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
  error: "shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  story: "shadow-[0_0_20px_rgba(168,85,247,0.6)]",
};

export default function StoryEventPopup({ event, onClose }: StoryEventPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (event) {
      setIsVisible(true);
      setIsLeaving(false);
      // Auto close after 5 seconds (longer than item popup for reading)
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [event, onClose]);

  if (!event || !isVisible) return null;

  const type = event.type || "story";
  const typeColor = TYPE_COLORS[type];
  const typeGlow = TYPE_GLOW[type];

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[55] pointer-events-auto story-popup-${
        isLeaving ? "out" : "in"
      }`}
      style={{ maxWidth: "90vw", width: "520px" }}
    >
      <div
        className={`bg-black/98 border-4 ${typeColor} ${typeGlow} pixel-border p-6 backdrop-blur-sm`}
        style={{
          borderImageSlice: 'fill',
          imageRendering: 'pixelated',
        }}
      >
        {/* Header with Icon */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-3 pixel-text" style={{ imageRendering: 'pixelated' }}>
            {event.icon || "💀"}
          </div>
          <div className={`text-xl font-pixel font-bold ${typeColor} mb-3 pixel-text uppercase tracking-wider`}>
            {event.title}
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-sm text-zinc-300 font-pixel mb-4 leading-relaxed border-t-2 border-zinc-800 pt-4 pixel-text">
          {event.description}
        </div>

        {/* Effect */}
        {event.effect && (
          <div className="text-center mt-4">
            <span
              className={`inline-block px-4 py-2 text-sm font-pixel font-bold border-2 ${typeColor} pixel-border uppercase`}
            >
              {event.effect}
            </span>
          </div>
        )}

        {/* Close Button */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-2 text-sm font-pixel uppercase border-2 ${typeColor} bg-black/50 hover:bg-black/80 transition-colors pixel-border cursor-pointer`}
          >
            Đóng
          </button>
        </div>

        {/* Subtle sparkle effect for story events - pixelated */}
        {type === "story" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 animate-ping pixel-text"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                  imageRendering: 'pixelated',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fadeOutScale {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        .story-popup-in {
          animation: fadeInScale 0.3s ease-out;
        }

        .story-popup-out {
          animation: fadeOutScale 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}

