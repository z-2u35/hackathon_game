"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { ASSET_PATHS } from "@/utils/assetLoader";

// Kích thước tile top-down (48px - GBA Pokémon style)
const TILE_SIZE = 48;
const GRID_WIDTH = 20; // Số cột
const GRID_HEIGHT = 15; // Số hàng

// Map data: 0 = floor (walkable), 1 = wall (obstacle)
const LEVEL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface TopDownLevelProps {
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

export default function TopDownLevel({
  lightLevel = 50,
  onInteract,
  onPlayerMove,
}: TopDownLevelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const worldContainerRef = useRef<PIXI.Container | null>(null);
  const playerPosRef = useRef({ x: 5, y: 7 }); // Grid position
  const isMovingRef = useRef(false);
  const [showInteractPrompt, setShowInteractPrompt] = useState(false);
  const [interactObject, setInteractObject] = useState<GameObject | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerSpriteRef = useRef<PIXI.Sprite | PIXI.Graphics | null>(null);
  const cameraRef = useRef<PIXI.Container | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Game objects trên map
  const gameObjectsRef = useRef<GameObject[]>([
    { type: "mirror", gridX: 8, gridY: 5 },
    { type: "mirror", gridX: 12, gridY: 8 },
    { type: "corpse", gridX: 10, gridY: 6 },
    { type: "chest", gridX: 15, gridY: 9 },
    { type: "door", gridX: 18, gridY: 7 },
  ]);

  // Helper: Check if position is valid và không có tường
  const isValidPosition = useCallback((x: number, y: number) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    return LEVEL_MAP[y][x] === 0; // 0 = floor (walkable)
  }, []);

  // Helper: Check if there's an interactable object at position
  const getObjectAt = useCallback((x: number, y: number) => {
    return gameObjectsRef.current.find(
      (obj) => obj.gridX === x && obj.gridY === y && !obj.interacted
    );
  }, []);

  // Grid movement: Di chuyển từng ô một với animation mượt (GBA style)
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isMovingRef.current) return;

      const newX = playerPosRef.current.x + dx;
      const newY = playerPosRef.current.y + dy;

      if (!isValidPosition(newX, newY)) return;

      isMovingRef.current = true;
      const startX = playerPosRef.current.x;
      const startY = playerPosRef.current.y;
      playerPosRef.current = { x: newX, y: newY };

      // Smooth animation từ ô A sang ô B (không dừng ở giữa)
      if (playerSpriteRef.current && worldContainerRef.current && appRef.current) {
        const startPixelX = startX * TILE_SIZE + TILE_SIZE / 2;
        const startPixelY = startY * TILE_SIZE + TILE_SIZE / 2;
        const targetPixelX = newX * TILE_SIZE + TILE_SIZE / 2;
        const targetPixelY = newY * TILE_SIZE + TILE_SIZE / 2;

        const duration = 200; // milliseconds
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease-out function cho movement mượt
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          const currentX = startPixelX + (targetPixelX - startPixelX) * easeProgress;
          const currentY = startPixelY + (targetPixelY - startPixelY) * easeProgress;

          if (playerSpriteRef.current) {
            playerSpriteRef.current.x = currentX;
            playerSpriteRef.current.y = currentY;
          }

          // Update camera smoothly (center player on screen)
          if (cameraRef.current && appRef.current) {
            cameraRef.current.x = -currentX + appRef.current.screen.width / 2;
            cameraRef.current.y = -currentY + appRef.current.screen.height / 2;
          }

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Đảm bảo vị trí cuối cùng chính xác
            if (playerSpriteRef.current) {
              playerSpriteRef.current.x = targetPixelX;
              playerSpriteRef.current.y = targetPixelY;
            }
            if (cameraRef.current && appRef.current) {
              cameraRef.current.x = -targetPixelX + appRef.current.screen.width / 2;
              cameraRef.current.y = -targetPixelY + appRef.current.screen.height / 2;
            }
            isMovingRef.current = false;
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Fallback nếu không có sprite
        isMovingRef.current = false;
      }

      // Check for interactable objects
      const obj = getObjectAt(newX, newY);
      if (obj) {
        setInteractObject(obj);
        setShowInteractPrompt(true);
      } else {
        setShowInteractPrompt(false);
        setInteractObject(null);
      }

      onPlayerMove?.(newX, newY);
    },
    [isValidPosition, getObjectAt, onPlayerMove]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysRef.current.has(key)) return;

      keysRef.current.add(key);

      // Movement (WASD / Arrow keys)
      if (key === "w" || key === "arrowup") {
        e.preventDefault();
        e.stopPropagation();
        movePlayer(0, -1);
      } else if (key === "s" || key === "arrowdown") {
        e.preventDefault();
        e.stopPropagation();
        movePlayer(0, 1);
      } else if (key === "a" || key === "arrowleft") {
        e.preventDefault();
        e.stopPropagation();
        movePlayer(-1, 0);
      } else if (key === "d" || key === "arrowright") {
        e.preventDefault();
        e.stopPropagation();
        movePlayer(1, 0);
      } else if (key === "f") {
        // Interact
        e.preventDefault();
        e.stopPropagation();
        if (interactObject) {
          onInteract?.(interactObject.type, interactObject.gridX, interactObject.gridY);
          interactObject.interacted = true;
          setShowInteractPrompt(false);
          setInteractObject(null);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [movePlayer, interactObject, onInteract]);

  // Initialize PixiJS
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const initApp = async () => {
      // Tạo PIXI Application
      const app = new PIXI.Application({
        width: containerRef.current!.clientWidth || window.innerWidth,
        height: containerRef.current!.clientHeight || window.innerHeight,
        backgroundColor: 0x0a0a0f,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      containerRef.current!.appendChild(app.view as unknown as Node);
      appRef.current = app;

      // Pixel art mode - Nearest neighbor scaling
      PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

      // ============================================
      // LOAD ASSETS (Async)
      // ============================================
      const floorTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.floor).catch(() => null);
      const wallTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.wall).catch(() => null);
      const mirrorTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.mirrorBroken).catch(() => null);
      const chestTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.chest).catch(() => null);
      const playerTexture = await PIXI.Assets.load(ASSET_PATHS.characters.player.idleDown).catch(() => null);

      // Fallback textures nếu không load được
      const createFallbackTexture = (color: number) => {
        const g = new PIXI.Graphics();
        g.beginFill(color);
        g.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        g.endFill();
        return app.renderer.generateTexture(g);
      };

      const fallbackFloor = createFallbackTexture(0x1a1a2e);
      const fallbackWall = createFallbackTexture(0x2d2d44);
      const fallbackMirror = createFallbackTexture(0x9d4edd);
      const fallbackChest = createFallbackTexture(0xd4a574);

      // ============================================
      // CAMERA CONTAINER (Để dễ dàng pan/zoom sau này)
      // ============================================
      const camera = new PIXI.Container();
      cameraRef.current = camera;
      app.stage.addChild(camera);

      // ============================================
      // WORLD CONTAINER (Chứa tất cả map và objects)
      // ============================================
      const worldContainer = new PIXI.Container();
      worldContainerRef.current = worldContainer;
      camera.addChild(worldContainer);

      // ============================================
      // LỚP 1: BACKGROUND - TilingSprite (Tối ưu FPS)
      // ============================================
      const mapWidth = GRID_WIDTH * TILE_SIZE;
      const mapHeight = GRID_HEIGHT * TILE_SIZE;

      const floorTilingSprite = new PIXI.TilingSprite({
        texture: floorTexture || fallbackFloor,
        width: mapWidth,
        height: mapHeight,
      });
      worldContainer.addChild(floorTilingSprite);

      // ============================================
      // LỚP 2: WALLS/OBSTACLES - Duyệt LEVEL_MAP
      // ============================================
      const wallsContainer = new PIXI.Container();
      worldContainer.addChild(wallsContainer);

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (LEVEL_MAP[y][x] === 1) {
            // Tạo sprite tường
            const wallSprite = new PIXI.Sprite(wallTexture || fallbackWall);
            wallSprite.x = x * TILE_SIZE;
            wallSprite.y = y * TILE_SIZE;
            wallSprite.width = TILE_SIZE;
            wallSprite.height = TILE_SIZE;
            wallsContainer.addChild(wallSprite);
          }
        }
      }

      // ============================================
      // LỚP 3: GAME OBJECTS (Mirrors, Chests, etc.)
      // ============================================
      const objectsContainer = new PIXI.Container();
      worldContainer.addChild(objectsContainer);

      gameObjectsRef.current.forEach((obj) => {
        let sprite: PIXI.Sprite | PIXI.Graphics;

        if (obj.type === "mirror") {
          sprite = new PIXI.Sprite(mirrorTexture || fallbackMirror);
        } else if (obj.type === "chest") {
          sprite = new PIXI.Sprite(chestTexture || fallbackChest);
        } else {
          // Fallback Graphics cho các object khác
          sprite = new PIXI.Graphics();
          if (obj.type === "corpse") {
            (sprite as PIXI.Graphics).beginFill(0x8b4513);
          } else if (obj.type === "door") {
            (sprite as PIXI.Graphics).beginFill(0x654321);
          } else {
            (sprite as PIXI.Graphics).beginFill(0x666666);
          }
          (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
          (sprite as PIXI.Graphics).endFill();
        }

        sprite.x = obj.gridX * TILE_SIZE;
        sprite.y = obj.gridY * TILE_SIZE;
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        objectsContainer.addChild(sprite);
      });

      // ============================================
      // LỚP 4: PLAYER
      // ============================================
      const playerContainer = new PIXI.Container();
      worldContainer.addChild(playerContainer);

      if (playerTexture) {
        const sprite = new PIXI.Sprite(playerTexture);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        sprite.anchor.set(0.5);
        sprite.x = playerPosRef.current.x * TILE_SIZE + TILE_SIZE / 2;
        sprite.y = playerPosRef.current.y * TILE_SIZE + TILE_SIZE / 2;
        playerContainer.addChild(sprite);
        playerSpriteRef.current = sprite;
      } else {
        // Fallback: vẽ bằng Graphics
        const fallback = new PIXI.Graphics();
        fallback.beginFill(0xffb94a);
        fallback.drawCircle(0, 0, TILE_SIZE / 2 - 2);
        fallback.endFill();
        fallback.x = playerPosRef.current.x * TILE_SIZE + TILE_SIZE / 2;
        fallback.y = playerPosRef.current.y * TILE_SIZE + TILE_SIZE / 2;
        playerContainer.addChild(fallback);
        playerSpriteRef.current = fallback;
      }

      // ============================================
      // CENTER MAP ON SCREEN (Căn giữa map lúc khởi tạo)
      // ============================================
      const mapCenterX = mapWidth / 2;
      const mapCenterY = mapHeight / 2;
      const screenCenterX = app.screen.width / 2;
      const screenCenterY = app.screen.height / 2;

      // Center camera on map center
      camera.x = screenCenterX - mapCenterX;
      camera.y = screenCenterY - mapCenterY;

      // Sau đó center camera on player
      const playerPixelX = playerPosRef.current.x * TILE_SIZE + TILE_SIZE / 2;
      const playerPixelY = playerPosRef.current.y * TILE_SIZE + TILE_SIZE / 2;
      camera.x = screenCenterX - playerPixelX;
      camera.y = screenCenterY - playerPixelY;

      // ============================================
      // LIGHTING EFFECT (dựa trên lightLevel)
      // ============================================
      const updateLighting = () => {
        const brightness = lightLevel / 100;
        worldContainer.alpha = Math.max(0.3, brightness);
      };

      updateLighting();
      const lightingInterval = setInterval(updateLighting, 100);

      // ============================================
      // RESPONSIVE: Handle window resize
      // ============================================
      const handleResize = () => {
        if (appRef.current && containerRef.current) {
          const newWidth = containerRef.current.clientWidth || window.innerWidth;
          const newHeight = containerRef.current.clientHeight || window.innerHeight;
          appRef.current.renderer.resize(newWidth, newHeight);

          // Re-center camera on player after resize
          if (cameraRef.current && playerSpriteRef.current) {
            const playerX = playerSpriteRef.current.x;
            const playerY = playerSpriteRef.current.y;
            cameraRef.current.x = newWidth / 2 - playerX;
            cameraRef.current.y = newHeight / 2 - playerY;
          }
        }
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        clearInterval(lightingInterval);
        window.removeEventListener("resize", handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        app.destroy(true);
      };
    };

    initApp().catch(console.error);
  }, []);

  // Update lighting khi lightLevel thay đổi
  useEffect(() => {
    if (worldContainerRef.current) {
      const brightness = lightLevel / 100;
      worldContainerRef.current.alpha = Math.max(0.3, brightness);
    }
  }, [lightLevel]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Interact Prompt */}
      {showInteractPrompt && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: "50%",
            top: "20%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-black/80 border-2 border-amber-500 px-4 py-2 rounded font-pixel text-sm text-amber-400">
            [F] Tương tác
          </div>
        </div>
      )}
    </div>
  );
}
