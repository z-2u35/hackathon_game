"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

// Kích thước tile isometric
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

interface MirrorHallwayGameProps {
  onChoice?: (choiceId: number, result: {
    hp?: number;
    oil?: number;
    sanity?: number;
    item?: string;
    code?: string;
  }) => void;
}

type GameChoice = 1 | 2 | 3 | null;

export default function MirrorHallwayGame({ onChoice }: MirrorHallwayGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [showDialog, setShowDialog] = useState(true);
  const [playerChoice, setPlayerChoice] = useState<GameChoice>(null);
  const playerPosRef = useRef({ x: 2, y: 0 });

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    // Khởi tạo Pixi Application
    const app = new PIXI.Application({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 600,
      backgroundColor: 0x0a0a0f,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Giữ pixel art sắc nét
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Container cho thế giới isometric
    const isoWorld = new PIXI.Container();
    isoWorld.x = app.screen.width / 2;
    isoWorld.y = 100;
    isoWorld.sortableChildren = true;
    app.stage.addChild(isoWorld);

    // Helper: chuyển grid coordinates -> isometric coordinates
    const toIso = (x: number, y: number) => ({
      x: (x - y) * (TILE_WIDTH / 2),
      y: (x + y) * (TILE_HEIGHT / 2),
    });

    // Tạo hành lang gương: 2 hàng gương, 1 hành lang ở giữa
    const hallwayWidth = 3; // Độ rộng hành lang
    const hallwayLength = 10; // Chiều dài hành lang

    // Vẽ sàn hành lang
    for (let x = 0; x < hallwayLength; x++) {
      for (let y = 0; y < hallwayWidth; y++) {
        const tile = new PIXI.Graphics();
        const color = (x + y) % 2 === 0 ? 0x1a1a2e : 0x16213e; // Sàn tối màu
        tile.beginFill(color);
        tile.lineStyle(1, 0x0f0f1a, 0.5);
        
        // Vẽ hình thoi isometric
        tile.moveTo(0, 0);
        tile.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, TILE_HEIGHT);
        tile.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, 0);
        tile.endFill();

        const isoPos = toIso(x, y);
        tile.x = isoPos.x;
        tile.y = isoPos.y;
        tile.zIndex = 0;
        isoWorld.addChild(tile);
      }
    }

    // Vẽ tường/gương bên trái (cột y = -1)
    for (let x = 0; x < hallwayLength; x++) {
      const mirror = new PIXI.Graphics();
      mirror.beginFill(0x4a5568); // Màu gương xám
      mirror.lineStyle(2, 0x718096, 1);
      
      // Vẽ gương với vết nứt
      mirror.moveTo(0, 0);
      mirror.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
      mirror.lineTo(0, TILE_HEIGHT);
      mirror.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
      mirror.lineTo(0, 0);
      mirror.endFill();

      // Vẽ vết nứt trên gương (đường zic zac)
      mirror.lineStyle(1, 0x2d3748, 0.8);
      const crackX = Math.random() * 20 - 10;
      mirror.moveTo(crackX, 5);
      mirror.lineTo(crackX + 5, 15);
      mirror.lineTo(crackX - 3, 25);

      const isoPos = toIso(x, -1);
      mirror.x = isoPos.x;
      mirror.y = isoPos.y;
      mirror.zIndex = 1;
      isoWorld.addChild(mirror);
    }

    // Vẽ tường/gương bên phải (cột y = hallwayWidth)
    for (let x = 0; x < hallwayLength; x++) {
      const mirror = new PIXI.Graphics();
      mirror.beginFill(0x4a5568);
      mirror.lineStyle(2, 0x718096, 1);
      
      mirror.moveTo(0, 0);
      mirror.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
      mirror.lineTo(0, TILE_HEIGHT);
      mirror.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
      mirror.lineTo(0, 0);
      mirror.endFill();

      // Vết nứt
      mirror.lineStyle(1, 0x2d3748, 0.8);
      const crackX = Math.random() * 20 - 10;
      mirror.moveTo(crackX, 5);
      mirror.lineTo(crackX - 5, 15);
      mirror.lineTo(crackX + 3, 25);

      const isoPos = toIso(x, hallwayWidth);
      mirror.x = isoPos.x;
      mirror.y = isoPos.y;
      mirror.zIndex = 1;
      isoWorld.addChild(mirror);
    }

    // Vẽ nhân vật (Seeker) - hình vuông đơn giản màu vàng cam (lantern)
    const player = new PIXI.Graphics();
    player.beginFill(0xffb94a); // Màu đèn lồng
    player.lineStyle(2, 0xff9500, 1);
    player.drawRect(-12, -20, 24, 24);
    player.endFill();
    
    // Vẽ đầu
    player.beginFill(0xffd700);
    player.drawCircle(0, -20, 8);
    player.endFill();

    const updatePlayerPos = () => {
      const isoPos = toIso(playerPosRef.current.x, playerPosRef.current.y);
      player.x = isoPos.x;
      player.y = isoPos.y + TILE_HEIGHT / 2 - 10;
      player.zIndex = 100;
    };

    updatePlayerPos();
    isoWorld.addChild(player);

    // Animation: nhân vật đi giữa hành lang
    let animFrame = 0;
    const animate = () => {
      animFrame++;
      if (animFrame % 60 === 0 && playerPosRef.current.x < hallwayLength - 1) {
        playerPosRef.current.x += 1;
        updatePlayerPos();
        isoWorld.sortChildren();
      }
    };

    app.ticker.add(animate);

    // Cleanup
    return () => {
      app.ticker.remove(animate);
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, []);

  // Xử lý lựa chọn của người chơi
  const handleChoice = (choice: GameChoice) => {
    setPlayerChoice(choice);
    setShowDialog(false);

    let result: {
      hp?: number;
      oil?: number;
      sanity?: number;
      item?: string;
      code?: string;
    } = {};

    switch (choice) {
      case 1: // Nắm lấy tay
        result = {
          hp: -10,
          item: "Glass Shard",
        };
        break;
      case 2: // Đập vỡ gương
        result = {
          oil: -5,
        };
        break;
      case 3: // Soi đèn (Max sáng)
        result = {
          sanity: -20,
          code: "4-0-4",
        };
        break;
    }

    onChoice?.(choice, result);
  };

  return (
    <div className="relative w-full h-full">
      {/* Canvas PixiJS */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[600px]"
        style={{ backgroundColor: "#0a0a0f" }}
      />

      {/* Dialog box với cốt truyện và lựa chọn */}
      {showDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="max-w-2xl w-full mx-4 bg-zinc-900 border-4 border-amber-600 p-6 rounded-lg font-pixel text-white">
            <h2 className="text-2xl text-amber-400 mb-4 border-b-2 border-amber-600 pb-2">
              🪞 HÀNH LANG GƯƠNG
            </h2>
            
            <div className="space-y-4 text-lg mb-6">
              <p className="text-zinc-200 leading-relaxed">
                Bạn đi giữa hai hàng gương nứt vỡ. Ánh sáng từ đèn lồng của bạn phản chiếu trên 
                những mảnh vỡ, tạo ra những bóng đen kỳ lạ...
              </p>
              
              <p className="text-red-300 font-bold">
                Đột nhiên, hình phản chiếu của bạn trong gương không làm theo động tác của bạn. 
                Nó đưa tay ra xin giúp đỡ, mắt nhìn đầy sợ hãi...
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl text-amber-300 mb-3">Bạn sẽ làm gì?</h3>
              
              <button
                onClick={() => handleChoice(1)}
                className="w-full text-left px-4 py-3 bg-zinc-800 hover:bg-red-900/30 border-2 border-zinc-600 hover:border-red-500 rounded transition-all font-pixel"
              >
                <span className="text-red-400">1. Nắm lấy tay nó</span>
                <span className="block text-sm text-zinc-400 mt-1">
                  Mất 10 HP (Bị kính cứa), Nhận item "Glass Shard" (Vũ khí)
                </span>
              </button>

              <button
                onClick={() => handleChoice(2)}
                className="w-full text-left px-4 py-3 bg-zinc-800 hover:bg-blue-900/30 border-2 border-zinc-600 hover:border-blue-500 rounded transition-all font-pixel"
              >
                <span className="text-blue-400">2. Đập vỡ gương</span>
                <span className="block text-sm text-zinc-400 mt-1">
                  Mất 5 Dầu (Tốn sức), Bảo toàn Sanity
                </span>
              </button>

              <button
                onClick={() => handleChoice(3)}
                className="w-full text-left px-4 py-3 bg-zinc-800 hover:bg-purple-900/30 border-2 border-zinc-600 hover:border-purple-500 rounded transition-all font-pixel"
              >
                <span className="text-purple-400">3. Soi đèn (Max sáng)</span>
                <span className="block text-sm text-zinc-400 mt-1">
                  Nhìn thấy con quỷ sau tấm gương → Mất 20 Sanity, Nhận Code mở cửa "4-0-4"
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị kết quả */}
      {!showDialog && playerChoice && (
        <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 border-2 border-amber-600 p-4 rounded font-pixel text-white">
          {playerChoice === 1 && (
            <div>
              <p className="text-red-400">💔 Bạn bị kính cứa khi nắm tay! Mất 10 HP.</p>
              <p className="text-green-400 mt-2">✨ Nhận được: Glass Shard (Vũ khí)</p>
            </div>
          )}
          {playerChoice === 2 && (
            <div>
              <p className="text-blue-400">💥 Bạn đập vỡ gương! Mất 5 Dầu.</p>
              <p className="text-green-400 mt-2">✅ Sanity được bảo toàn.</p>
            </div>
          )}
          {playerChoice === 3 && (
            <div>
              <p className="text-purple-400">👁️ Bạn nhìn thấy con quỷ đằng sau gương! Mất 20 Sanity.</p>
              <p className="text-green-400 mt-2">🔑 Nhận được mã: 4-0-4</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

