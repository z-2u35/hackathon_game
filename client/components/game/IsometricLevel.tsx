"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as PIXI from "pixi.js";

// Kích thước tile isometric
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;
const GRID_WIDTH = 10; // Số cột
const GRID_HEIGHT = 3; // Số hàng (hành lang)

interface IsometricLevelProps {
  lightLevel?: number; // 0-100
  onInteract?: (objectType: string, gridX: number, gridY: number) => void;
  onPlayerMove?: (x: number, y: number) => void;
}

interface GameObject {
  type: "mirror" | "chest" | "door" | "corpse";
  gridX: number;
  gridY: number;
  interacted?: boolean;
}

export default function IsometricLevel({
  lightLevel = 50,
  onInteract,
  onPlayerMove,
}: IsometricLevelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const playerPosRef = useRef({ x: 1, y: 1 }); // Grid position
  const isMovingRef = useRef(false);
  const [showInteractPrompt, setShowInteractPrompt] = useState(false);
  const [interactObject, setInteractObject] = useState<GameObject | null>(null);
  const keysRef = useRef<Set<string>>(new Set());

  // Game objects trên map
  const gameObjectsRef = useRef<GameObject[]>([
    { type: "mirror", gridX: 3, gridY: 0 },
    { type: "mirror", gridX: 6, gridY: 2 },
    { type: "corpse", gridX: 5, gridY: 1 },
    { type: "door", gridX: 9, gridY: 1 },
  ]);

  // Helper: Convert grid coordinates to isometric screen coordinates
  const toIso = useCallback((x: number, y: number) => {
    return {
      x: (x - y) * (TILE_WIDTH / 2),
      y: (x + y) * (TILE_HEIGHT / 2),
    };
  }, []);

  // Helper: Check if position is valid
  const isValidPosition = useCallback((x: number, y: number) => {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
  }, []);

  // Helper: Check if there's an interactable object at position
  const getObjectAt = useCallback((x: number, y: number) => {
    return gameObjectsRef.current.find(
      (obj) => obj.gridX === x && obj.gridY === y && !obj.interacted
    );
  }, []);

  // Initialize PixiJS
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: containerRef.current.clientWidth || 800,
      height: containerRef.current.clientHeight || 600,
      backgroundColor: 0x0a0a0f,
      antialias: false,
      resolution: 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Pixel art mode
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Container cho thế giới isometric
    const isoWorld = new PIXI.Container();
    isoWorld.x = app.screen.width / 2;
    isoWorld.y = 100;
    isoWorld.sortableChildren = true;
    app.stage.addChild(isoWorld);

    // ============================================
    // VẼ SÀN GẠCH ĐÁ CỔ (Dungeon Floor)
    // ============================================
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        const tile = new PIXI.Graphics();
        const color = (x + y) % 2 === 0 ? 0x1a1a2e : 0x16213e; // Alternating dark blue
        tile.beginFill(color);
        tile.lineStyle(1, 0x0f0f1a, 0.5);

        // Vẽ hình thoi isometric
        tile.moveTo(0, 0);
        tile.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, TILE_HEIGHT);
        tile.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
        tile.lineTo(0, 0);
        tile.endFill();

        // Thêm texture cho gạch đá
        const noise = new PIXI.Graphics();
        noise.beginFill(0xffffff, 0.05);
        for (let i = 0; i < 3; i++) {
          const px = (Math.random() - 0.5) * TILE_WIDTH;
          const py = (Math.random() - 0.5) * TILE_HEIGHT;
          noise.drawRect(px, py, 2, 2);
        }
        noise.endFill();
        tile.addChild(noise);

        const isoPos = toIso(x, y);
        tile.x = isoPos.x;
        tile.y = isoPos.y;
        tile.zIndex = 0;
        isoWorld.addChild(tile);
      }
    }

    // ============================================
    // VẼ TƯỜNG BAO QUANH - CẢI THIỆN
    // ============================================
    // Tường trái
    for (let x = 0; x < GRID_WIDTH; x++) {
      const wall = new PIXI.Graphics();
      const baseColor = 0x2d3748;
      const darkColor = 0x1a202c;
      const highlightColor = 0x3d4758;
      
      wall.beginFill(baseColor);
      wall.lineStyle(2, darkColor, 1);

      const isoPos = toIso(x, -1);
      wall.x = isoPos.x;
      wall.y = isoPos.y - TILE_HEIGHT / 2;

      // Vẽ tường isometric (hình chữ nhật nghiêng)
      wall.moveTo(0, 0);
      wall.lineTo(TILE_WIDTH / 2, -TILE_HEIGHT);
      wall.lineTo(TILE_WIDTH, 0);
      wall.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);
      wall.lineTo(0, 0);
      wall.endFill();

      // Highlight trên cạnh trên
      wall.lineStyle(2, highlightColor, 0.5);
      wall.moveTo(0, 0);
      wall.lineTo(TILE_WIDTH / 2, -TILE_HEIGHT);
      wall.lineTo(TILE_WIDTH, 0);

      // Brick pattern chi tiết hơn
      for (let i = 0; i < 3; i++) {
        wall.lineStyle(1, darkColor, 0.4);
        const brickX = (i * TILE_WIDTH) / 3;
        wall.moveTo(brickX, 0);
        wall.lineTo(brickX + TILE_WIDTH / 6, -TILE_HEIGHT);
        
        // Thêm shadow cho mỗi viên gạch
        wall.lineStyle(1, darkColor, 0.2);
        wall.moveTo(brickX + TILE_WIDTH / 6, -TILE_HEIGHT);
        wall.lineTo(brickX + TILE_WIDTH / 3, 0);
      }

      // Moss/stains
      if (Math.random() > 0.5) {
        wall.beginFill(0x1a2e1a, 0.3);
        const mossX = Math.random() * TILE_WIDTH;
        const mossY = -Math.random() * TILE_HEIGHT;
        wall.drawCircle(mossX, mossY, 4 + Math.random() * 4);
        wall.endFill();
      }

      wall.zIndex = 1;
      isoWorld.addChild(wall);
    }

    // Tường phải
    for (let x = 0; x < GRID_WIDTH; x++) {
      const wall = new PIXI.Graphics();
      const baseColor = 0x2d3748;
      const darkColor = 0x1a202c;
      const highlightColor = 0x3d4758;
      
      wall.beginFill(baseColor);
      wall.lineStyle(2, darkColor, 1);

      const isoPos = toIso(x, GRID_HEIGHT);
      wall.x = isoPos.x;
      wall.y = isoPos.y - TILE_HEIGHT / 2;

      wall.moveTo(0, 0);
      wall.lineTo(TILE_WIDTH / 2, -TILE_HEIGHT);
      wall.lineTo(TILE_WIDTH, 0);
      wall.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);
      wall.lineTo(0, 0);
      wall.endFill();

      // Highlight
      wall.lineStyle(2, highlightColor, 0.5);
      wall.moveTo(0, 0);
      wall.lineTo(TILE_WIDTH / 2, -TILE_HEIGHT);
      wall.lineTo(TILE_WIDTH, 0);

      // Brick pattern
      for (let i = 0; i < 3; i++) {
        wall.lineStyle(1, darkColor, 0.4);
        const brickX = (i * TILE_WIDTH) / 3;
        wall.moveTo(brickX, 0);
        wall.lineTo(brickX + TILE_WIDTH / 6, -TILE_HEIGHT);
        
        wall.lineStyle(1, darkColor, 0.2);
        wall.moveTo(brickX + TILE_WIDTH / 6, -TILE_HEIGHT);
        wall.lineTo(brickX + TILE_WIDTH / 3, 0);
      }

      // Moss/stains
      if (Math.random() > 0.5) {
        wall.beginFill(0x1a2e1a, 0.3);
        const mossX = Math.random() * TILE_WIDTH;
        const mossY = -Math.random() * TILE_HEIGHT;
        wall.drawCircle(mossX, mossY, 4 + Math.random() * 4);
        wall.endFill();
      }

      wall.zIndex = 1;
      isoWorld.addChild(wall);
    }

    // ============================================
    // VẼ GAME OBJECTS (Gương, Rương, Cửa, Xác)
    // ============================================
    const objectSprites: Map<string, PIXI.Graphics> = new Map();

    gameObjectsRef.current.forEach((obj) => {
      const sprite = new PIXI.Graphics();
      const isoPos = toIso(obj.gridX, obj.gridY);

      switch (obj.type) {
        case "mirror":
          // Gương vỡ - cải thiện với reflection effect
          const mirrorWidth = TILE_WIDTH / 2;
          const mirrorHeight = TILE_HEIGHT * 2;
          
          // Base mirror
          sprite.beginFill(0x4a5568, 0.9);
          sprite.lineStyle(3, 0x718096, 1);
          sprite.drawRect(-mirrorWidth / 2, -mirrorHeight / 2, mirrorWidth, mirrorHeight);
          sprite.endFill();
          
          // Reflection highlight
          sprite.beginFill(0x6a7588, 0.4);
          sprite.drawRect(-mirrorWidth / 2, -mirrorHeight / 2, mirrorWidth, mirrorHeight / 3);
          sprite.endFill();
          
          // Vết nứt chi tiết hơn
          sprite.lineStyle(2, 0x1a202c, 0.9);
          // Nứt chính
          sprite.moveTo(-mirrorWidth / 2, -mirrorHeight / 2);
          sprite.lineTo(mirrorWidth / 4, mirrorHeight / 2);
          // Nứt phụ
          sprite.lineStyle(1, 0x2a3038, 0.7);
          sprite.moveTo(mirrorWidth / 4, -mirrorHeight / 2);
          sprite.lineTo(-mirrorWidth / 4, mirrorHeight / 2);
          // Nứt nhỏ
          sprite.lineStyle(1, 0x1a202c, 0.5);
          sprite.moveTo(0, -mirrorHeight / 3);
          sprite.lineTo(mirrorWidth / 3, mirrorHeight / 4);
          
          // Frame
          sprite.lineStyle(2, 0x8b4513, 1);
          sprite.drawRect(-mirrorWidth / 2 - 2, -mirrorHeight / 2 - 2, mirrorWidth + 4, mirrorHeight + 4);
          break;

        case "corpse":
          // Xác chết - cải thiện với chi tiết hơn
          const corpseSize = TILE_WIDTH / 3;
          
          // Body (hình oval)
          sprite.beginFill(0x3d2817);
          sprite.drawEllipse(0, 0, corpseSize, TILE_HEIGHT);
          sprite.endFill();
          
          // Shadow
          sprite.beginFill(0x1a0f0a, 0.6);
          sprite.drawEllipse(0, TILE_HEIGHT / 2, corpseSize * 1.2, TILE_HEIGHT / 3);
          sprite.endFill();
          
          // Cloth/rags
          sprite.beginFill(0x2a1a0f, 0.8);
          sprite.drawEllipse(0, -TILE_HEIGHT / 4, corpseSize * 0.8, TILE_HEIGHT / 2);
          sprite.endFill();
          
          // Cross (grave marker)
          sprite.lineStyle(3, 0x8b4513, 1);
          // Horizontal
          sprite.moveTo(-corpseSize, 0);
          sprite.lineTo(corpseSize, 0);
          // Vertical
          sprite.moveTo(0, -TILE_HEIGHT);
          sprite.lineTo(0, TILE_HEIGHT);
          
          // Skull icon (simple)
          sprite.beginFill(0x4a3a2a, 0.9);
          sprite.drawCircle(0, -TILE_HEIGHT / 2, 3);
          sprite.endFill();
          break;

        case "door":
          // Cửa - cải thiện với chi tiết
          const doorWidth = (TILE_WIDTH * 2) / 3;
          const doorHeight = TILE_HEIGHT * 3;
          
          // Base door
          sprite.beginFill(0x2d1b0e);
          sprite.lineStyle(4, 0x8b4513, 1);
          sprite.drawRect(-doorWidth / 2, -doorHeight / 2, doorWidth, doorHeight);
          sprite.endFill();
          
          // Wood planks
          for (let i = 0; i < 3; i++) {
            sprite.lineStyle(2, 0x1a0f08, 0.6);
            const plankY = -doorHeight / 2 + (i * doorHeight) / 3;
            sprite.moveTo(-doorWidth / 2, plankY);
            sprite.lineTo(doorWidth / 2, plankY);
          }
          
          // Vertical planks
          sprite.lineStyle(1, 0x1a0f08, 0.4);
          sprite.moveTo(-doorWidth / 4, -doorHeight / 2);
          sprite.lineTo(-doorWidth / 4, doorHeight / 2);
          sprite.moveTo(doorWidth / 4, -doorHeight / 2);
          sprite.lineTo(doorWidth / 4, doorHeight / 2);
          
          // Handle (golden)
          sprite.beginFill(0xffd700);
          sprite.lineStyle(1, 0xffaa00, 1);
          sprite.drawCircle(doorWidth / 3, 0, 5);
          sprite.endFill();
          
          // Handle highlight
          sprite.beginFill(0xffffaa, 0.6);
          sprite.drawCircle(doorWidth / 3 - 1, -1, 2);
          sprite.endFill();
          
          // Lock/keyhole (nếu bị khóa)
          sprite.beginFill(0x1a0f08);
          sprite.drawCircle(0, -doorHeight / 3, 3);
          sprite.endFill();
          break;

        case "chest":
          // Rương - hình hộp
          sprite.beginFill(0x8b4513);
          sprite.lineStyle(2, 0x654321, 1);
          sprite.drawRect(-TILE_WIDTH / 3, -TILE_HEIGHT / 2, (TILE_WIDTH * 2) / 3, TILE_HEIGHT);
          sprite.endFill();
          break;
      }

      sprite.x = isoPos.x;
      sprite.y = isoPos.y - TILE_HEIGHT;
      sprite.zIndex = 2;
      sprite.interactive = false; // Sẽ dùng keyboard để tương tác
      objectSprites.set(`${obj.gridX}-${obj.gridY}`, sprite);
      isoWorld.addChild(sprite);
    });

    // ============================================
    // VẼ NHÂN VẬT (Player Sprite) - CẢI THIỆN
    // ============================================
    const playerSprite = new PIXI.Graphics();
    
    // Body (robe/cloak)
    playerSprite.beginFill(0x2a1a0f);
    playerSprite.lineStyle(2, 0x1a0f08, 1);
    playerSprite.drawRect(-8, -TILE_HEIGHT / 2 + 10, 16, TILE_HEIGHT / 2 + 2);
    playerSprite.endFill();
    
    // Head
    playerSprite.beginFill(0xffb94a);
    playerSprite.lineStyle(2, 0xff9500, 1);
    playerSprite.drawCircle(0, -TILE_HEIGHT / 2, 8);
    playerSprite.endFill();
    
    // Face (simple eyes)
    playerSprite.beginFill(0x1a0f08);
    playerSprite.drawCircle(-2, -TILE_HEIGHT / 2 - 1, 1);
    playerSprite.drawCircle(2, -TILE_HEIGHT / 2 - 1, 1);
    playerSprite.endFill();
    
    // Lantern (held in hand)
    playerSprite.beginFill(0xffb94a, 0.8);
    playerSprite.lineStyle(1, 0xff9500, 1);
    playerSprite.drawCircle(10, -TILE_HEIGHT / 2 + 5, 4);
    playerSprite.endFill();
    
    // Lantern glow
    playerSprite.beginFill(0xffb94a, 0.3);
    playerSprite.drawCircle(10, -TILE_HEIGHT / 2 + 5, 6);
    playerSprite.endFill();
    
    // Cloak highlight
    playerSprite.lineStyle(1, 0x3a2a1f, 0.5);
    playerSprite.moveTo(-8, -TILE_HEIGHT / 2 + 10);
    playerSprite.lineTo(0, -TILE_HEIGHT / 2 + 8);
    playerSprite.lineTo(8, -TILE_HEIGHT / 2 + 10);

    const updatePlayerPosition = () => {
      const isoPos = toIso(playerPosRef.current.x, playerPosRef.current.y);
      playerSprite.x = isoPos.x;
      playerSprite.y = isoPos.y;
      playerSprite.zIndex = 10; // Luôn ở trên cùng
      
      // Update glow position (glowCircle được khai báo sau)
      if (glowCircle) {
        glowCircle.x = isoPos.x;
        glowCircle.y = isoPos.y;
      }
    };

    // ============================================
    // LIGHTING SYSTEM - Glow Effect (using Graphics)
    // ============================================
    // Tạo glow effect bằng cách vẽ một vòng tròn mờ phía sau player
    const glowCircle = new PIXI.Graphics();
    glowCircle.beginFill(0xffb94a, 0.3);
    glowCircle.drawCircle(0, 0, 30);
    glowCircle.endFill();
    glowCircle.zIndex = 9; // Ngay dưới player
    isoWorld.addChild(glowCircle);

    // Adjust glow based on light level
    const updateLighting = () => {
      const intensity = lightLevel / 100;
      const glowRadius = 20 + intensity * 30; // 20-50
      const glowAlpha = 0.2 + intensity * 0.3; // 0.2-0.5
      
      glowCircle.clear();
      glowCircle.beginFill(0xffb94a, glowAlpha);
      glowCircle.drawCircle(0, 0, glowRadius);
      glowCircle.endFill();
      
      // Update glow position to follow player
      const isoPos = toIso(playerPosRef.current.x, playerPosRef.current.y);
      glowCircle.x = isoPos.x;
      glowCircle.y = isoPos.y;
    };

    // Add player sprite to world
    isoWorld.addChild(playerSprite);
    
    // Initial position update (sau khi glowCircle và updateLighting đã được tạo)
    updatePlayerPosition();
    updateLighting();

    // ============================================
    // ANIMATION - Player bobbing
    // ============================================
    let bobOffset = 0;
    let bobDirection = 1;
    app.ticker.add(() => {
      // Bobbing animation khi đứng yên
      if (!isMovingRef.current) {
        bobOffset += bobDirection * 0.2;
        if (bobOffset > 3) bobDirection = -1;
        if (bobOffset < -3) bobDirection = 1;
        const isoPos = toIso(playerPosRef.current.x, playerPosRef.current.y);
        playerSprite.y = isoPos.y + bobOffset;
        // Update glow position too
        if (glowCircle) {
          glowCircle.y = isoPos.y + bobOffset;
        }
      }
      
      // Update lighting based on lightLevel prop
      const intensity = lightLevel / 100;
      const glowRadius = 20 + intensity * 30;
      const glowAlpha = 0.2 + intensity * 0.3;
      if (glowCircle) {
        const isoPos = toIso(playerPosRef.current.x, playerPosRef.current.y);
        glowCircle.x = isoPos.x;
        glowCircle.y = isoPos.y + bobOffset;
        glowCircle.clear();
        glowCircle.beginFill(0xffb94a, glowAlpha);
        glowCircle.drawCircle(0, 0, glowRadius);
        glowCircle.endFill();
      }
    });

    // ============================================
    // KEYBOARD INPUT HANDLING
    // ============================================
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Prevent default behavior cho các phím di chuyển để tránh scroll
      const movementKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "f"];
      if (movementKeys.includes(key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      keysRef.current.add(key);

      // Movement (WASD or Arrow keys)
      if ((key === "w" || key === "arrowup") && !isMovingRef.current) {
        movePlayer(0, -1);
      } else if ((key === "s" || key === "arrowdown") && !isMovingRef.current) {
        movePlayer(0, 1);
      } else if ((key === "a" || key === "arrowleft") && !isMovingRef.current) {
        movePlayer(-1, 0);
      } else if ((key === "d" || key === "arrowright") && !isMovingRef.current) {
        movePlayer(1, 0);
      }

      // Interact (F key)
      if (key === "f" && interactObject) {
        if (onInteract) {
          onInteract(interactObject.type, interactObject.gridX, interactObject.gridY);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const movePlayer = (dx: number, dy: number) => {
      const newX = playerPosRef.current.x + dx;
      const newY = playerPosRef.current.y + dy;

      if (!isValidPosition(newX, newY)) return;

      isMovingRef.current = true;
      playerPosRef.current.x = newX;
      playerPosRef.current.y = newY;

      // Smooth movement animation
      const startPos = toIso(playerPosRef.current.x - dx, playerPosRef.current.y - dy);
      const endPos = toIso(newX, newY);
      const startTime = Date.now();
      const duration = 200; // milliseconds

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        playerSprite.x = startPos.x + (endPos.x - startPos.x) * easeProgress;
        playerSprite.y = startPos.y + (endPos.y - startPos.y) * easeProgress + bobOffset;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isMovingRef.current = false;
          updatePlayerPosition();
          updateLighting(); // Update glow position

          // Check for interactable objects
          checkInteractables();
        }
      };

      animate();

      if (onPlayerMove) {
        onPlayerMove(newX, newY);
      }
    };

    const checkInteractables = () => {
      const obj = getObjectAt(playerPosRef.current.x, playerPosRef.current.y);
      if (obj) {
        setInteractObject(obj);
        setShowInteractPrompt(true);
      } else {
        setInteractObject(null);
        setShowInteractPrompt(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Initial check - delay để đảm bảo state đã được set
    setTimeout(() => {
      checkInteractables();
    }, 100);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && appRef.current) {
        app.renderer.resize(
          containerRef.current.clientWidth || 800,
          containerRef.current.clientHeight || 600
        );
        isoWorld.x = app.screen.width / 2;
        updatePlayerPosition();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      if (appRef.current) {
        app.ticker.stop();
        app.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [toIso, isValidPosition, getObjectAt, lightLevel, onInteract, onPlayerMove]);

  // Update lighting when lightLevel changes
  useEffect(() => {
    // Lighting update sẽ được handle trong PixiJS ticker
    // Glow circle sẽ được update trong updateLighting function
  }, [lightLevel]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ touchAction: 'none' }}>
      <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />

      {/* Interact Prompt - Hiển thị khi đứng cạnh vật thể */}
      {showInteractPrompt && interactObject && (
        <div
          className="absolute z-40 pointer-events-none animate-pulse"
          style={{
            left: "50%",
            top: "25%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-lg animate-pulse" />
            
            {/* Main prompt box */}
            <div className="relative bg-gradient-to-b from-zinc-900 to-black border-4 border-amber-500 px-6 py-3 rounded-lg font-pixel shadow-2xl">
              {/* Key indicator */}
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 text-black px-3 py-1 rounded border-2 border-amber-300 font-bold text-lg shadow-lg">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">
                    Tương tác
                  </span>
                  <span className="text-zinc-300 text-xs">
                    {interactObject.type === "mirror" 
                      ? "🪞 Nhìn vào Gương Vỡ" 
                      : interactObject.type === "corpse" 
                      ? "💀 Kiểm tra Xác Chết" 
                      : interactObject.type === "door" 
                      ? "🚪 Mở Cửa" 
                      : "📦 Mở Rương"}
                  </span>
                </div>
              </div>
              
              {/* Pulsing indicator */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/60 border border-zinc-600 px-3 py-2 rounded text-xs text-zinc-400 font-pixel z-30">
        WASD: Di chuyển | F: Tương tác
      </div>
    </div>
  );
}

