"use client";

import { useState } from "react";
import GameHUD from "./GameHUD";
import InventoryModal, { GameItem } from "./InventoryModal";
import ActionConsole from "./ActionConsole";
import LightSlider from "./LightSlider";
import ActionLog from "./ActionLog";
import TopDownLevel from "./TopDownLevel";
import DialogueBox from "./DialogueBox";
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
  const [lightLevel, setLightLevel] = useState(50); // Default 50%
  const [dialogue, setDialogue] = useState<{
    text: string;
    speaker?: string;
    choices?: Array<{ id: number; text: string }>;
  } | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const playerStats = usePlayerStats();

  // Sử dụng props nếu có, không thì lấy từ hook
  const lanternId = propLanternId ?? playerStats.lanternObjects[0]?.data?.objectId ?? "";
  const currentOil = stats?.oil ?? playerStats.oil ?? 0;
  const currentHealth = stats?.health ?? playerStats.hp ?? 100;
  const currentSanity = stats?.sanity ?? playerStats.sanity ?? 0;

  // Mock inventory với rarity examples
  const defaultInventory: GameItem[] = inventory.length > 0 ? inventory : [
    {
      id: "1",
      name: "Blade of Scourge",
      icon: "⚔️",
      description: "Lưỡi kiếm bị nguyền rủa, sắc bén nhưng hao tổn Sanity.",
      type: "weapon",
      rarity: "cursed",
      effect: { sanity: -5 },
    },
    {
      id: "2",
      name: "Lens of Truth",
      icon: "🔍",
      description: "Kính thần giúp nhìn thấy sự thật ẩn giấu.",
      type: "tool",
      rarity: "legendary",
      effect: { sanity: -10 },
    },
    {
      id: "3",
      name: "Sanity Pill",
      icon: "💊",
      description: "Viên thuốc hồi phục tinh thần.",
      type: "consumable",
      rarity: "rare",
      effect: { sanity: 20 },
    },
    {
      id: "4",
      name: "Wyrm Oil",
      icon: "🛢️",
      description: "Dầu từ xác rồng, hồi phục đèn lồng.",
      type: "consumable",
      rarity: "epic",
      effect: { oil: 30 },
    },
  ];

  const addLog = (msg: string, type?: "info" | "warning" | "success" | "error") => {
    addGameLog(msg, type || "info");
  };

  const handleMove = () => {
    addLog('<span class="text-yellow-400">👣 Bạn đang di chuyển...</span>');
    // TODO: Implement move logic
  };

  const handleRest = () => {
    addLog('<span class="text-green-400">😴 Nghỉ ngơi... Hồi phục Sanity, mất Oil.</span>');
    // TODO: Implement rest logic
  };

  const handleSearch = () => {
    addLog('<span class="text-blue-400">🔍 Bạn đang tìm kiếm...</span>');
    // TODO: Implement search logic
  };

  const handleAttack = () => {
    addLog('<span class="text-red-400">⚔️ Tấn công!</span>');
    // TODO: Implement attack logic
  };

  const handleFocusLight = () => {
    if (currentOil < 10) {
      addLog('<span class="text-red-400">⚠️ Không đủ Dầu để làm choáng!</span>', "error");
      return;
    }
    addLog('<span class="text-amber-400">💡 Làm choáng kẻ địch! (-10 Oil)</span>');
    // TODO: Implement focus light logic
  };

  const handleWhisper = () => {
    if (currentSanity < 20) {
      addLog('<span class="text-red-400">⚠️ Sanity quá thấp để dùng Memory Shard!</span>', "error");
      return;
    }
    addLog('<span class="text-purple-400">💬 Sử dụng Memory Shard... (-20 Sanity)</span>');
    // TODO: Implement whisper logic
  };

  // Handle interaction với game objects
  const handleInteract = (objectType: string, gridX: number, gridY: number) => {
    switch (objectType) {
      case "mirror":
        setDialogue({
          text: "Ngươi nhìn vào gương... khuôn mặt không phải của ngươi. Một cảm giác lạnh lẽo chạy dọc sống lưng.",
          speaker: "Gương Vỡ",
        });
        addLog('<span class="text-purple-400">👁️ Nhận được: +5 Sanity (nhưng cảm thấy bất an...)</span>', "info");
        // TODO: Update stats
        break;

      case "corpse":
        setDialogue({
          text: "Một xác chết khô héo. Trong tay hắn có một chiếc chìa khóa cũ kỹ.",
          speaker: "Xác Chết",
          choices: [
            { id: 1, text: "Nhặt chìa khóa" },
            { id: 2, text: "Bỏ qua" },
          ],
        });
        break;

      case "door":
        if (inventory.some((item) => item.name === "Old Key")) {
          setDialogue({
            text: "Cửa mở ra... Bạn đã vượt qua Hành lang Gương!",
            speaker: "Cửa",
          });
          addLog('<span class="text-green-400">✨ Đã hoàn thành Màn 1!</span>', "success");
          // TODO: Next level logic
        } else {
          setDialogue({
            text: "Cửa bị khóa. Bạn cần một chiếc chìa khóa để mở.",
            speaker: "Cửa",
          });
        }
        break;

      default:
        break;
    }
  };

  // Handle dialogue choice
  const handleDialogueChoice = (choiceId: number) => {
    if (dialogue?.text.includes("chìa khóa")) {
      if (choiceId === 1) {
        addLog('<span class="text-green-400">🔑 Nhặt được: Old Key</span>', "success");
        // TODO: Add item to inventory
      }
    }
    setDialogue(null);
  };

  // Handle player movement
  const handlePlayerMove = (x: number, y: number) => {
    setPlayerPosition({ x, y });
    addLog(`<span class="text-zinc-300">Vị trí: (${x}, ${y})</span>`, "info");
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ touchAction: 'none' }}>
      {/* ============================================ */}
      {/* LAYER 0: Top-Down Game Canvas (Dưới cùng) */}
      {/* ============================================ */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {children ? (
          children
        ) : (
          <TopDownLevel
            lightLevel={lightLevel}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
          />
        )}
      </div>

      {/* ============================================ */}
      {/* LAYER 1: HUD Overlay (Các cạnh màn hình) */}
      {/* ============================================ */}

      {/* HUD - Góc trái trên */}
      <GameHUD
        oil={currentOil}
        health={currentHealth}
        sanity={currentSanity}
        lanternId={lanternId}
      />

      {/* Light Slider - Góc dưới giữa */}
      <LightSlider
        lightLevel={lightLevel}
        onLightChange={setLightLevel}
        oil={currentOil}
        sanity={currentSanity}
      />

      {/* Action Console - Góc dưới phải */}
      <ActionConsole
        onMove={handleMove}
        onRest={handleRest}
        onSearch={handleSearch}
        onAttack={handleAttack}
        onFocusLight={handleFocusLight}
        onWhisper={handleWhisper}
        canMove={playerStats.isAlive !== false && currentOil > 0}
        oil={currentOil}
        sanity={currentSanity}
      />

      {/* Action Log - Center bottom (above LightSlider) */}
      <ActionLog />

      {/* Dialogue Box - Bottom (Layer 2) */}
      {dialogue && (
        <DialogueBox
          text={dialogue.text}
          speaker={dialogue.speaker}
          choices={dialogue.choices}
          onClose={() => setDialogue(null)}
          onChoice={handleDialogueChoice}
        />
      )}

      {/* ============================================ */}
      {/* LAYER 2: Modals (Popup giữa màn hình) */}
      {/* ============================================ */}

      {/* Inventory Modal */}
      {isInvOpen && (
        <div className="pointer-events-auto z-50">
          <InventoryModal
            items={defaultInventory}
            onClose={() => setInvOpen(false)}
            onUse={(item) => {
              addLog(`<span class="text-green-400">✨ Đã sử dụng: ${item.name}</span>`, "success");
              setInvOpen(false);
            }}
            onDrop={(item) => {
              addLog(`<span class="text-red-400">🗑️ Đã vứt: ${item.name}</span>`, "warning");
              setInvOpen(false);
            }}
          />
        </div>
      )}

      {/* Inventory Button - Floating (không nằm trong ActionConsole) */}
      <button
        onClick={() => setInvOpen(true)}
        className="absolute top-4 right-4 h-12 w-12 bg-zinc-800 border-2 border-zinc-500 rounded hover:bg-zinc-700 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center relative group pointer-events-auto z-30"
      >
        <span className="text-xl">🎒</span>
        {defaultInventory.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-pixel">
            {defaultInventory.length}
          </span>
        )}
      </button>
    </div>
  );
}
