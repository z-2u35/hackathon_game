"use client";

import { useState } from "react";
import DungeonGameHUD from "./DungeonGameHUD";
import ActionButtons from "./ActionButtons";
import ActionLog from "./ActionLog";
import InventoryModal, { GameItem } from "./InventoryModal";

interface GameInterfaceProps {
  children: React.ReactNode; // Isometric game canvas
  onMove: () => void;
  onAttack?: () => void;
  onInteract?: () => void;
  canMove?: boolean;
  items?: GameItem[];
  onUseItem?: (item: GameItem) => void;
  onDropItem?: (item: GameItem) => void;
}

export default function GameInterface({
  children,
  onMove,
  onAttack,
  onInteract,
  canMove = true,
  items = [],
  onUseItem,
  onDropItem,
}: GameInterfaceProps) {
  const [showInventory, setShowInventory] = useState(false);

  // Mock items - có thể lấy từ game state sau
  const defaultItems: GameItem[] = items.length > 0 ? items : [
    {
      id: "1",
      name: "Bình Dầu Cũ",
      icon: "🛢️",
      description: "Một bình dầu cũ, có thể hồi 20 Oil.",
      type: "consumable",
      effect: { oil: 20 },
    },
    {
      id: "2",
      name: "Chìa Khóa Đồng",
      icon: "🗝️",
      description: "Chìa khóa để mở cửa phòng bí mật.",
      type: "key",
    },
    {
      id: "3",
      name: "Mảnh Kính",
      icon: "🔪",
      description: "Mảnh kính sắc, có thể dùng làm vũ khí.",
      type: "weapon",
    },
  ];

  const handleUseItem = (item: GameItem) => {
    if (onUseItem) {
      onUseItem(item);
    } else {
      // Default behavior
      console.log("Using item:", item);
      if (item.effect) {
        // Apply effect logic here
      }
    }
    setShowInventory(false);
  };

  const handleDropItem = (item: GameItem) => {
    if (onDropItem) {
      onDropItem(item);
    } else {
      console.log("Dropping item:", item);
    }
    setShowInventory(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Isometric Game Canvas - Lớp dưới cùng */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* HUD Layer - Lớp phủ */}
      <DungeonGameHUD />

      {/* Action Buttons - Góc dưới phải */}
      <ActionButtons
        onMove={onMove}
        onAttack={onAttack}
        onInteract={onInteract}
        onInventory={() => setShowInventory(true)}
        canMove={canMove}
      />

      {/* Action Log - Dưới giữa */}
      <ActionLog />

      {/* Inventory Modal */}
      {showInventory && (
        <InventoryModal
          items={defaultItems}
          onClose={() => setShowInventory(false)}
          onUse={handleUseItem}
          onDrop={handleDropItem}
        />
      )}
    </div>
  );
}

