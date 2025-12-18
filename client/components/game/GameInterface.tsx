"use client";

import { useState, useEffect, useRef } from "react";
import GameHUD from "./GameHUD";
import InventoryModal, { GameItem } from "./InventoryModal";
import ActionConsole from "./ActionConsole";
import LightSlider from "./LightSlider";
import ActionLog from "./ActionLog";
import TopDownLevel from "./TopDownLevel";
import ItemNotificationPopup from "./ItemNotificationPopup";
import StoryEventPopup from "./StoryEventPopup";
// DialogueBox disabled - không sử dụng nữa
// import DialogueBox from "./DialogueBox";
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
  // Dialogue state disabled
  // const [dialogue, setDialogue] = useState<{
  //   text: string;
  //   speaker?: string;
  //   choices?: Array<{ id: number; text: string }>;
  // } | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [itemNotification, setItemNotification] = useState<{
    name: string;
    icon?: string;
    description?: string;
    rarity?: "common" | "rare" | "epic" | "legendary" | "cursed";
  } | null>(null);
  
  const [storyEvent, setStoryEvent] = useState<{
    title: string;
    description: string;
    icon?: string;
    effect?: string;
    type?: "info" | "warning" | "success" | "error" | "story";
  } | null>(null);
  
  // Story progression state cho Màn 1: Hành lang Gương
  const [storyProgress, setStoryProgress] = useState({
    hasSeenFirstMirror: false,
    hasFoundCorpse: false,
    hasOldKey: false,
    hasOpenedDoor: false,
    mirrorsInteracted: 0,
  });
  
  const playerStats = usePlayerStats();

  // Local state cho oil và sanity để có thể update theo thời gian
  const [localOil, setLocalOil] = useState<number | null>(null);
  const [localSanity, setLocalSanity] = useState<number | null>(null);
  const lastOilWarningRef = useRef<number>(0); // Track last oil warning time

  // Sử dụng props nếu có, không thì lấy từ hook
  const lanternId = propLanternId ?? playerStats.lanternObjects[0]?.data?.objectId ?? "";
  const baseOil = stats?.oil ?? playerStats.oil ?? 0;
  const baseHealth = stats?.health ?? playerStats.hp ?? 100;
  const baseSanity = stats?.sanity ?? playerStats.sanity ?? 0;

  // Use local state if available, otherwise use base values
  const currentOil = localOil !== null ? localOil : baseOil;
  const currentHealth = baseHealth;
  const currentSanity = localSanity !== null ? localSanity : baseSanity;

  // Sync local state khi props/stats thay đổi (nhưng chỉ khi local state chưa được set)
  useEffect(() => {
    if (localOil === null) setLocalOil(baseOil);
    if (localSanity === null) setLocalSanity(baseSanity);
  }, [baseOil, baseSanity, localOil, localSanity]);

  // Calculate consumption rates based on light level
  const getOilConsumptionRate = (level: number) => {
    if (level <= 30) return 0.5; // Stealth: 50% consumption
    if (level <= 70) return 1.0; // Normal: 100% consumption
    return 2.0; // Truth: 200% consumption
  };

  const getSanityDrainRate = (level: number) => {
    if (level > 70) return 1.5; // Truth: 150% drain
    return 1.0; // Normal drain
  };

  // Oil and Sanity consumption over time
  useEffect(() => {
    const consumptionRate = getOilConsumptionRate(lightLevel);
    const drainRate = getSanityDrainRate(lightLevel);
    
    // Oil consumption: 1 point every 2 seconds * consumption rate
    const oilInterval = setInterval(() => {
      setLocalOil((prev) => {
        if (prev === null || prev <= 0) return prev; // Stop if already empty
        const newOil = Math.max(0, prev - (consumptionRate * 0.5));
        
        // Warning khi oil thấp
        if (newOil < 20 && prev >= 20 && Date.now() - lastOilWarningRef.current > 5000) {
          addGameLog('<span class="text-red-400">⚠️ Dầu sắp cạn! Hãy tắt đèn hoặc tìm dầu.</span>', "warning");
          lastOilWarningRef.current = Date.now();
        }
        
        // Oil hết
        if (newOil <= 0 && prev > 0) {
          addGameLog('<span class="text-red-400">🕯️ Đèn đã tắt! Bạn đang ở trong bóng tối...</span>', "error");
        }
        
        return newOil;
      });

      // Sanity drain: 0.5 point every 2 seconds * drain rate (chỉ khi ở Truth mode)
      if (lightLevel > 70) {
        setLocalSanity((prev) => {
          if (prev === null || prev <= 0) return prev;
          return Math.max(0, prev - (drainRate * 0.25));
        });
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(oilInterval);
  }, [lightLevel, baseOil, baseSanity]);

  // Reset local oil/sanity when base values change significantly (e.g., from blockchain update)
  useEffect(() => {
    if (Math.abs(baseOil - (localOil ?? baseOil)) > 10) {
      setLocalOil(baseOil);
    }
    if (Math.abs(baseSanity - (localSanity ?? baseSanity)) > 10) {
      setLocalSanity(baseSanity);
    }
  }, [baseOil, baseSanity]);

  // Dynamic inventory - start with empty, add items as player collects them
  const [collectedItems, setCollectedItems] = useState<GameItem[]>([]);
  
  const defaultInventory: GameItem[] = inventory.length > 0 
    ? inventory 
    : collectedItems.length > 0 
      ? collectedItems 
      : [];

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

  // Handle interaction với game objects - Story progression + Item notifications
  const handleInteract = (objectType: string, gridX: number, gridY: number) => {
    switch (objectType) {
      case "mirror":
        setStoryProgress((prev) => ({
          ...prev,
          mirrorsInteracted: prev.mirrorsInteracted + 1,
          hasSeenFirstMirror: true,
        }));
        
        // First mirror - Story introduction
        if (storyProgress.mirrorsInteracted === 0) {
          addLog('<span class="text-purple-400">🪞 Bạn nhìn vào gương vỡ... Khuôn mặt trong gương không phải của bạn. Một cảm giác lạnh lẽo chạy dọc sống lưng.</span>', "info");
          addLog('<span class="text-purple-400">👁️ +5 Sanity (nhưng cảm thấy bất an...)</span>', "info");
          
          // Update sanity
          setLocalSanity((prev) => Math.min(100, (prev ?? baseSanity) + 5));
        } else {
          // Subsequent mirrors - More disturbing
          addLog('<span class="text-purple-400">🪞 Gương lại... Hình ảnh phản chiếu vẫn không khớp. Bạn nghe thấy tiếng thì thầm từ phía sau...</span>', "warning");
          addLog('<span class="text-purple-400">👁️ +3 Sanity</span>', "info");
          setLocalSanity((prev) => Math.min(100, (prev ?? baseSanity) + 3));
        }
        break;

      case "corpse":
        if (!storyProgress.hasFoundCorpse) {
          setStoryProgress((prev) => ({ ...prev, hasFoundCorpse: true }));
          
          // Show story popup first
          setStoryEvent({
            title: "Xác Chết",
            description: "Một xác chết khô héo nằm trên nền đá lạnh. Trong tay hắn có một chiếc chìa khóa cũ kỹ, rỉ sét.",
            icon: "💀",
            effect: "Tìm thấy chìa khóa",
            type: "info",
          });
          
          addLog('<span class="text-zinc-400">💀 Một xác chết khô héo nằm trên nền đá lạnh. Trong tay hắn có một chiếc chìa khóa cũ kỹ, rỉ sét.</span>', "info");
          
          // Add Old Key to inventory after a short delay
          setTimeout(() => {
            const oldKeyItem: GameItem = {
              id: "old-key-" + Date.now(),
              name: "Old Key",
              icon: "🔑",
              description: "Chiếc chìa khóa cổ kính, có thể mở cánh cửa cuối hành lang.",
              type: "tool",
              rarity: "common",
              effect: {},
            };
            
            setCollectedItems((prev) => [...prev, oldKeyItem]);
            setStoryProgress((prev) => ({ ...prev, hasOldKey: true }));
            
            // Show item notification popup
            setItemNotification({
              name: "Old Key",
              icon: "🔑",
              description: "Chiếc chìa khóa cổ kính, có thể mở cánh cửa cuối hành lang.",
              rarity: "common",
            });
            
            addLog('<span class="text-green-400">🔑 Nhặt được: Old Key</span>', "success");
          }, 1500);
        } else {
          setStoryEvent({
            title: "Xác Chết",
            description: "Xác chết vẫn nằm đó, im lặng...",
            icon: "💀",
            type: "info",
          });
          addLog('<span class="text-zinc-400">💀 Xác chết vẫn nằm đó, im lặng...</span>', "info");
        }
        break;

      case "door":
        const hasKey = storyProgress.hasOldKey || defaultInventory.some((item) => item.name === "Old Key");
        if (hasKey) {
          if (!storyProgress.hasOpenedDoor) {
            setStoryProgress((prev) => ({ ...prev, hasOpenedDoor: true }));
            
            // Show door opening story popup
            setStoryEvent({
              title: "Cửa Mở Ra",
              description: "Bạn đưa chìa khóa vào ổ khóa... Cửa từ từ mở ra với tiếng kẽo kẹt. Ánh sáng phía trước rọi vào hành lang tối tăm.",
              icon: "🚪",
              effect: "Màn 1 hoàn thành!",
              type: "success",
            });
            
            addLog('<span class="text-green-400">🔑 Bạn đưa chìa khóa vào ổ khóa... Cửa từ từ mở ra với tiếng kẽo kẹt.</span>', "success");
            
            // Show completion notification after door popup
            setTimeout(() => {
              setStoryEvent({
                title: "✨ Màn 1 Hoàn Thành!",
                description: "Bạn đã vượt qua Hành lang Gương. Ánh sáng phía trước đang chờ đợi...",
                icon: "✨",
                effect: "Câu chuyện tiếp tục ở Màn 2...",
                type: "success",
              });
            }, 4500);
            
            setTimeout(() => {
              addLog('<span class="text-green-400">🚪 Cửa mở ra... Ánh sáng phía trước rọi vào hành lang tối tăm.</span>', "success");
              addLog('<span class="text-amber-400">✨ Đã hoàn thành Màn 1: Hành lang Gương!</span>', "success");
              addLog('<span class="text-zinc-300">📖 Câu chuyện tiếp tục ở Màn 2...</span>', "info");
            }, 2000);
          } else {
            setStoryEvent({
              title: "Cửa Đã Mở",
              description: "Cửa đã mở. Bạn có thể bước vào...",
              icon: "🚪",
              type: "info",
            });
            addLog('<span class="text-green-400">🚪 Cửa đã mở. Bạn có thể bước vào...</span>', "info");
          }
        } else {
          setStoryEvent({
            title: "Cửa Bị Khóa",
            description: "Cửa bị khóa chặt. Bạn cần một chiếc chìa khóa để mở.",
            icon: "🔒",
            effect: "Tìm chìa khóa trong hành lang",
            type: "warning",
          });
          addLog('<span class="text-red-400">🔒 Cửa bị khóa chặt. Bạn cần một chiếc chìa khóa để mở.</span>', "warning");
          addLog('<span class="text-zinc-400">💡 Gợi ý: Tìm kiếm trong hành lang, có thể có ai đó đã để lại chìa khóa...</span>', "info");
        }
        break;

      case "chest":
        setStoryEvent({
          title: "Rương Cổ",
          description: "Bạn tìm thấy một chiếc rương cổ. Có vẻ như nó đã bị khóa từ lâu...",
          icon: "📦",
          effect: "Cần chìa khóa để mở",
          type: "info",
        });
        addLog('<span class="text-amber-400">📦 Bạn tìm thấy một chiếc rương cổ. Có vẻ như nó đã bị khóa từ lâu...</span>', "info");
        // TODO: Add chest interaction logic
        break;

      default:
        break;
    }
  };

  // Handle dialogue choice - Disabled
  // const handleDialogueChoice = (choiceId: number) => {
  //   if (dialogue?.text.includes("chìa khóa")) {
  //     if (choiceId === 1) {
  //       addLog('<span class="text-green-400">🔑 Nhặt được: Old Key</span>', "success");
  //       // TODO: Add item to inventory
  //     }
  //   }
  //   setDialogue(null);
  // };

  // Handle player movement
  const handlePlayerMove = (x: number, y: number) => {
    setPlayerPosition({ x, y });
    addLog(`<span class="text-zinc-300">Vị trí: (${x}, ${y})</span>`, "info");
  };

  return (
    <div 
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden" 
      style={{ 
        touchAction: 'none',
        overscrollBehavior: 'none'
      }}
    >
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

      {/* Light Slider - Bottom center (above ActionConsole) */}
      <LightSlider
        lightLevel={lightLevel}
        onLightChange={setLightLevel}
        oil={currentOil}
        sanity={currentSanity}
      />

      {/* Action Log - Bottom left (Position tracking & game events) */}
      <div className="absolute bottom-4 left-4 pointer-events-auto z-30" style={{ maxWidth: 'calc(50% - 8px)' }}>
        <ActionLog playerPosition={playerPosition} />
      </div>

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

      {/* Dialogue Box - Disabled */}
      {/* {dialogue && (
        <DialogueBox
          text={dialogue.text}
          speaker={dialogue.speaker}
          choices={dialogue.choices}
          onClose={() => setDialogue(null)}
          onChoice={handleDialogueChoice}
        />
      )} */}

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
        className="absolute top-20 right-4 h-12 w-12 bg-zinc-800 border-2 border-zinc-500 rounded hover:bg-zinc-700 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center relative group pointer-events-auto z-40"
      >
        <span className="text-xl">🎒</span>
        {defaultInventory.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-pixel">
            {defaultInventory.length}
          </span>
        )}
      </button>

      {/* Item Notification Popup */}
      <ItemNotificationPopup
        item={itemNotification}
        onClose={() => setItemNotification(null)}
      />

      {/* Story Event Popup */}
      <StoryEventPopup
        event={storyEvent}
        onClose={() => setStoryEvent(null)}
      />
    </div>
  );
}
