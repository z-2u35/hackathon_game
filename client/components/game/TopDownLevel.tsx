"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { ASSET_PATHS } from "@/utils/assetLoader";

// Kích thước tile top-down (48px - GBA Pokémon style)
const TILE_SIZE = 48;
const GRID_WIDTH = 25; // Số cột (hành lang dài)
const GRID_HEIGHT = 7; // Số hàng (hành lang hẹp)
const MOVE_SPEED = 4; // Pixel per frame (tốc độ di chuyển mượt)

// Map data: Hành lang gương - layout dài và hẹp với gương ở 2 bên
// 0 = floor (walkable), 1 = wall (obstacle)
const LEVEL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Top wall
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Left side
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Center hallway
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Center hallway
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Right side
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Left side
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Bottom wall
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

// Helper: Linear interpolation
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Helper: Validate textures array - trả về mảng textures hợp lệ
const validateTextures = (textures: PIXI.Texture[]): PIXI.Texture[] => {
  return textures.filter(t => {
    if (!t) return false;
    if (t === PIXI.Texture.EMPTY) return false;
    if (!t.baseTexture) return false;
    if (!t.baseTexture.valid) return false;
    if (t.baseTexture.width <= 0 || t.baseTexture.height <= 0) return false;
    return true;
  });
};

// Helper: Tạo AnimatedSprite an toàn - trả về null nếu không thể tạo
const createSafeAnimatedSprite = (
  textures: PIXI.Texture[],
  options?: { animationSpeed?: number; width?: number; height?: number }
): PIXI.AnimatedSprite | null => {
  const validTextures = validateTextures(textures);
  
  if (validTextures.length === 0) {
    console.warn('[createSafeAnimatedSprite] No valid textures provided');
    return null;
  }
  
  try {
    // Final check: Đảm bảo mảng textures không rỗng và không có giá trị null/undefined
    if (validTextures.length === 0) {
      console.error('[createSafeAnimatedSprite] ValidTextures array is empty');
      return null;
    }
    
    // Đảm bảo không có giá trị null/undefined trong mảng
    for (const tex of validTextures) {
      if (!tex || tex === PIXI.Texture.EMPTY) {
        console.error('[createSafeAnimatedSprite] Found invalid texture in array');
        return null;
      }
    }
    
    const sprite = new PIXI.AnimatedSprite(validTextures);
    
    // Kiểm tra totalFrames ngay sau khi tạo - TRƯỚC KHI LÀM BẤT CỨ GÌ
    if (sprite.totalFrames === 0 || sprite.totalFrames === undefined) {
      console.error('[createSafeAnimatedSprite] AnimatedSprite created with 0 frames, destroying sprite');
      sprite.destroy();
      return null;
    }
    
    if (options) {
      if (options.animationSpeed !== undefined) {
        sprite.animationSpeed = options.animationSpeed;
      }
      if (options.width !== undefined) {
        sprite.width = options.width;
      }
      if (options.height !== undefined) {
        sprite.height = options.height;
      }
    }
    
    return sprite;
  } catch (error) {
    console.error('[createSafeAnimatedSprite] Error creating AnimatedSprite:', error);
    return null;
  }
};

export default function TopDownLevel({
  lightLevel = 50,
  onInteract,
  onPlayerMove,
}: TopDownLevelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const worldContainerRef = useRef<PIXI.Container | null>(null);
  
  // Tách biệt grid position (logic) và visual position (pixel)
  const gridPositionRef = useRef({ x: 2, y: 3 }); // Grid position (logic) - Bắt đầu ở đầu hành lang
  const visualPositionRef = useRef({ x: 0, y: 0 }); // Pixel position (visual)
  const targetPositionRef = useRef<{ x: number; y: number } | null>(null); // Target pixel position
  const isMovingRef = useRef(false);
  const bobbingFrameRef = useRef(0); // Frame counter cho bobbing effect
  
  const [showInteractPrompt, setShowInteractPrompt] = useState(false);
  const [interactObject, setInteractObject] = useState<GameObject | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  // Type cho player sprite với custom properties
  type PlayerSpriteTextures = {
    idle: {
      down: PIXI.Texture[];
      up: PIXI.Texture[];
      left: PIXI.Texture[];
      right: PIXI.Texture[];
    };
    walk: {
      down: PIXI.Texture[];
      up: PIXI.Texture[];
      left: PIXI.Texture[];
      right: PIXI.Texture[];
    };
  };
  
  type PlayerSprite = (PIXI.AnimatedSprite | PIXI.Sprite | PIXI.Graphics) & {
    textures?: PlayerSpriteTextures;
    currentDirection?: 'up' | 'down' | 'left' | 'right';
  };
  const playerSpriteRef = useRef<PlayerSprite | null>(null);
  const cameraRef = useRef<PIXI.Container | null>(null);
  const tickerRef = useRef<PIXI.Ticker | null>(null);

  // Game objects trên map - Hành lang gương với gương ở 2 bên
  const gameObjectsRef = useRef<GameObject[]>([
    // Gương ở bên trái (y=1, 3, 5)
    { type: "mirror", gridX: 1, gridY: 1 },
    { type: "mirror", gridX: 1, gridY: 3 },
    { type: "mirror", gridX: 1, gridY: 5 },
    // Gương ở bên phải (y=2, 4)
    { type: "mirror", gridX: 23, gridY: 2 },
    { type: "mirror", gridX: 23, gridY: 4 },
    // Gương ở giữa hành lang (alternating)
    { type: "mirror", gridX: 5, gridY: 1 },
    { type: "mirror", gridX: 10, gridY: 5 },
    { type: "mirror", gridX: 15, gridY: 1 },
    { type: "mirror", gridX: 20, gridY: 5 },
    // Skeleton ở giữa hành lang
    { type: "corpse", gridX: 12, gridY: 3 },
    // Chest ở cuối hành lang
    { type: "chest", gridX: 22, gridY: 3 },
    // Cửa ở cuối hành lang
    { type: "door", gridX: 23, gridY: 3 },
  ]);

  // Helper: Check if position is valid và không có tường
  const isValidPosition = useCallback((x: number, y: number) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    if (!LEVEL_MAP[y] || LEVEL_MAP[y][x] === undefined) return false;
    return LEVEL_MAP[y][x] === 0; // 0 = floor (walkable)
  }, []);

  // Helper: Check if there's an interactable object at position
  const getObjectAt = useCallback((x: number, y: number) => {
    return gameObjectsRef.current.find(
      (obj) => obj.gridX === x && obj.gridY === y && !obj.interacted
    );
  }, []);

  // Helper: Convert grid position to pixel position
  const gridToPixel = useCallback((gridX: number, gridY: number) => {
    return {
      x: gridX * TILE_SIZE + TILE_SIZE / 2,
      y: gridY * TILE_SIZE + TILE_SIZE / 2,
    };
  }, []);

  // Helper: Update player sprite direction và animation state
  const updatePlayerDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right', isMoving: boolean = false) => {
    if (!playerSpriteRef.current) {
      console.warn('[updatePlayerDirection] No player sprite');
      return;
    }
    
    const sprite = playerSpriteRef.current;
    if (!sprite.textures) {
      console.warn('[updatePlayerDirection] No textures stored on sprite');
      return;
    }
    
    // Chọn textures dựa trên state (idle hoặc walk)
    const animationType = isMoving ? 'walk' : 'idle';
    const texturesByState = sprite.textures[animationType];
    
    console.log(`[updatePlayerDirection] Direction: ${direction}, isMoving: ${isMoving}, animationType: ${animationType}`);
    console.log('[updatePlayerDirection] texturesByState:', texturesByState);
    
    if (!texturesByState) {
      console.warn(`[updatePlayerDirection] No texturesByState[${animationType}]`);
      return;
    }
    
    if (!texturesByState[direction]) {
      console.warn(`[updatePlayerDirection] No texturesByState[${animationType}][${direction}]`);
      return;
    }
    
    if (texturesByState[direction].length === 0) {
      console.warn(`[updatePlayerDirection] texturesByState[${animationType}][${direction}] is empty`);
      return;
    }

    const directionTextures = texturesByState[direction];
    console.log(`[updatePlayerDirection] Found ${directionTextures.length} textures for ${direction}`);
    
    // Animation speed: nhanh hơn khi đang di chuyển (walk), chậm hơn khi đứng yên (idle)
    const animationSpeed = isMoving ? 0.3 : 0.15;
    
    // If already an AnimatedSprite, just change textures and speed
    if (sprite instanceof PIXI.AnimatedSprite) {
      // Validate textures before updating - filter ra null, undefined, và EMPTY
      const validTextures = directionTextures.filter(t => {
        if (!t) return false;
        if (t === PIXI.Texture.EMPTY) return false;
        if (!t.baseTexture || !t.baseTexture.valid) return false;
        return true;
      });
      
      if (validTextures.length === 0) {
        console.warn(`[updatePlayerDirection] No valid textures for ${direction} (${directionTextures.length} total, all invalid), skipping`);
        return;
      }
      
      // Stop animation trước khi thay đổi textures
      sprite.stop();
      (sprite as any).textures = validTextures;
      
      // Kiểm tra totalFrames sau khi set textures
      if (sprite.totalFrames > 0) {
        sprite.animationSpeed = animationSpeed;
        sprite.currentDirection = direction;
        sprite.gotoAndPlay(0); // Restart animation từ frame đầu và play
        console.log(`[updatePlayerDirection] Updated AnimatedSprite to ${direction}, isMoving: ${isMoving}, frames: ${validTextures.length}`);
      } else {
        console.error(`[updatePlayerDirection] AnimatedSprite has 0 frames after setting textures, direction: ${direction}`);
        // Không gọi gotoAndPlay nếu không có frames
      }
    } else {
      // Replace sprite with animated sprite
      const parent = sprite.parent;
      if (parent && sprite.textures) {
        // Validate textures before creating AnimatedSprite - filter ra null, undefined, và EMPTY
        const validTextures = directionTextures.filter(t => {
          if (!t) return false;
          if (t === PIXI.Texture.EMPTY) return false;
          if (!t.baseTexture || !t.baseTexture.valid) return false;
          return true;
        });
        
        if (validTextures.length === 0) {
          console.warn(`[updatePlayerDirection] No valid textures for ${direction} (${directionTextures.length} total, all invalid), skipping replacement`);
          return;
        }
        
        // Sử dụng helper function để tạo AnimatedSprite an toàn
        const newAnimatedSprite = createSafeAnimatedSprite(directionTextures, {
          animationSpeed: animationSpeed,
          width: TILE_SIZE,
          height: TILE_SIZE,
        });
        
        if (!newAnimatedSprite) {
          console.error(`[updatePlayerDirection] Cannot create AnimatedSprite for ${direction}`);
          return; // Không tạo sprite mới nếu không thể tạo
        }
        
        newAnimatedSprite.anchor.set(0.5);
        newAnimatedSprite.x = sprite.x;
        newAnimatedSprite.y = sprite.y;
        
        const newSprite = newAnimatedSprite as PlayerSprite;
        newSprite.textures = sprite.textures; // Store all textures
        newSprite.currentDirection = direction;
        newAnimatedSprite.play();
        
        parent.removeChild(sprite);
        parent.addChild(newAnimatedSprite);
        playerSpriteRef.current = newSprite;
        return; // Exit early since we replaced the sprite
      }
    }
  }, []);

  // Smooth movement: Di chuyển từng ô một với interpolation mượt
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      // Nếu đang di chuyển, không cho phép di chuyển tiếp
      if (isMovingRef.current) return;

      // Tính toán hướng di chuyển trước khi kiểm tra collision
      let moveDirection: 'up' | 'down' | 'left' | 'right' | null = null;
      if (dy < 0) {
        moveDirection = 'up';
      } else if (dy > 0) {
        moveDirection = 'down';
      } else if (dx < 0) {
        moveDirection = 'left';
      } else if (dx > 0) {
        moveDirection = 'right';
      }

      // Update player direction TRƯỚC khi kiểm tra collision để nhân vật quay ngay
      if (moveDirection) {
        updatePlayerDirection(moveDirection, true);
      }

      const newGridX = gridPositionRef.current.x + dx;
      const newGridY = gridPositionRef.current.y + dy;

      // Kiểm tra collision sau khi đã cập nhật direction
      if (!isValidPosition(newGridX, newGridY)) {
        // Nếu không thể di chuyển, chuyển về idle animation
        if (moveDirection && playerSpriteRef.current) {
          updatePlayerDirection(moveDirection, false);
        }
        return;
      }

      // Cập nhật grid position (logic)
      gridPositionRef.current = { x: newGridX, y: newGridY };

      // Tính toán target pixel position
      const targetPixel = gridToPixel(newGridX, newGridY);
      targetPositionRef.current = targetPixel;

      // Bắt đầu di chuyển
      isMovingRef.current = true;

      // Check for interactable objects
      const obj = getObjectAt(newGridX, newGridY);
      if (obj) {
        setInteractObject(obj);
        setShowInteractPrompt(true);
      } else {
        setShowInteractPrompt(false);
        setInteractObject(null);
      }

      onPlayerMove?.(newGridX, newGridY);
    },
    [isValidPosition, getObjectAt, onPlayerMove, gridToPixel, updatePlayerDirection]
  );

  // Setup PIXI Ticker để cập nhật di chuyển mượt mỗi frame
  const setupTicker = useCallback(() => {
    if (!appRef.current || tickerRef.current) return;

    const ticker = appRef.current.ticker;
    tickerRef.current = ticker;

    ticker.add(() => {
      if (!isMovingRef.current || !targetPositionRef.current || !playerSpriteRef.current || !cameraRef.current || !appRef.current) {
        return;
      }

      const target = targetPositionRef.current;
      const current = visualPositionRef.current;

      // Tính khoảng cách đến đích
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Nếu đã đến gần đích (khoảng cách < 1px), snap vào đích và kết thúc di chuyển
      if (distance < 1) {
        visualPositionRef.current.x = target.x;
        visualPositionRef.current.y = target.y;
        
        if (playerSpriteRef.current) {
          playerSpriteRef.current.x = target.x;
          playerSpriteRef.current.y = target.y; // Reset Y về đúng vị trí (không có bobbing)
          bobbingFrameRef.current = 0; // Reset bobbing frame
        }

        // Cập nhật camera
        const screenWidth = appRef.current.renderer?.width || window.innerWidth;
        const screenHeight = appRef.current.renderer?.height || window.innerHeight;
        cameraRef.current.x = -target.x + screenWidth / 2;
        cameraRef.current.y = -target.y + screenHeight / 2;

        // Kết thúc di chuyển - chuyển về idle animation
        isMovingRef.current = false;
        targetPositionRef.current = null;
        bobbingFrameRef.current = 0; // Reset bobbing frame
        
        // Chuyển về idle animation (chậm hơn)
        if (playerSpriteRef.current && playerSpriteRef.current.currentDirection) {
          updatePlayerDirection(playerSpriteRef.current.currentDirection, false);
        }
        return;
      }

      // Di chuyển mượt bằng lerp
      // Tính tốc độ dựa trên khoảng cách để đảm bảo tốc độ ổn định
      const moveFactor = Math.min(1, MOVE_SPEED / distance);
      
      visualPositionRef.current.x = lerp(current.x, target.x, moveFactor);
      visualPositionRef.current.y = lerp(current.y, target.y, moveFactor);

      // Cập nhật sprite position với bobbing effect khi di chuyển
      if (playerSpriteRef.current) {
        playerSpriteRef.current.x = visualPositionRef.current.x;
        
        // Bobbing effect: nhân vật nhấp nhô nhẹ khi đi (sin wave dựa trên frame)
        bobbingFrameRef.current += 0.5;
        const bobbingOffset = Math.sin(bobbingFrameRef.current) * 1.5; // Nhấp nhô 1.5px
        playerSpriteRef.current.y = visualPositionRef.current.y + bobbingOffset;
      }

      // Cập nhật camera mượt theo player (center player on screen)
      const screenWidth = appRef.current.renderer?.width || window.innerWidth;
      const screenHeight = appRef.current.renderer?.height || window.innerHeight;
      cameraRef.current.x = -visualPositionRef.current.x + screenWidth / 2;
      cameraRef.current.y = -visualPositionRef.current.y + screenHeight / 2;
    });
  }, []);

  // Keyboard controls với preventDefault - CHẶN SCROLL TUYỆT ĐỐI
  useEffect(() => {
    // Danh sách phím game cần chặn scroll (chuyển tất cả về lowercase để so sánh dễ hơn)
    const GAME_KEYS_LOWER = ["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "f"];

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. CHẶN SCROLL NGAY LẬP TỨC - DÒNG ĐẦU TIÊN (TRƯỚC MỌI LOGIC KHÁC)
      const key = e.key.toLowerCase();
      const isGameKey = GAME_KEYS_LOWER.includes(key);
      
      if (isGameKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      // 2. Logic game chạy sau
      if (keysRef.current.has(key)) return;
      keysRef.current.add(key);

      // Movement (WASD / Arrow keys)
      if (key === "w" || key === "arrowup") {
        movePlayer(0, -1);
      } else if (key === "s" || key === "arrowdown") {
        movePlayer(0, 1);
      } else if (key === "a" || key === "arrowleft") {
        movePlayer(-1, 0);
      } else if (key === "d" || key === "arrowright") {
        movePlayer(1, 0);
      } else if (key === " " || key === "space") {
        // Space bar - chỉ chặn scroll, không làm gì
      } else if (key === "f") {
        // Interact
        if (interactObject) {
          onInteract?.(interactObject.type, interactObject.gridX, interactObject.gridY);
          interactObject.interacted = true;
          setShowInteractPrompt(false);
          setInteractObject(null);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyNormalized = e.key.toLowerCase();
      // Chặn scroll cho keyup cũng
      if (GAME_KEYS_LOWER.includes(keyNormalized)) {
        e.preventDefault();
      }
      keysRef.current.delete(keyNormalized);
    };

    // Sử dụng capture phase để chặn sớm hơn
    document.addEventListener("keydown", handleKeyDown, { passive: false, capture: true });
    document.addEventListener("keyup", handleKeyUp, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true } as any);
      document.removeEventListener("keyup", handleKeyUp, { capture: true } as any);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [movePlayer, interactObject, onInteract]);

  // Initialize PixiJS
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const initApp = async () => {
      // Tạo PIXI Application
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
      
      const app = new PIXI.Application({
        width: containerWidth,
        height: containerHeight,
        backgroundColor: 0x0a0a0f,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!containerRef.current) {
        console.error('Container ref is null');
        return;
      }

      containerRef.current.appendChild(app.view as unknown as Node);
      appRef.current = app;

      // Pixel art mode - Nearest neighbor scaling
      PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

      // Đợi renderer được khởi tạo hoàn toàn
      await new Promise(resolve => {
        if (app.renderer && (app.renderer as any).gl) {
          resolve(undefined);
        } else {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve(undefined));
          });
        }
      });

      // ============================================
      // LOAD ASSETS (Async)
      // ============================================
      const floorTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.floor).catch(() => null);
      const wallTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.wall).catch(() => null);
      const mirrorTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.props.mirror).catch(() => null);
      const chestTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.props.chest).catch(() => null);
      const skeletonTexture = await PIXI.Assets.load(ASSET_PATHS.tilesets.props.skeleton).catch(() => null);
      
      // Load player sprite (first frame of idle down animation)
      const playerTexture = await PIXI.Assets.load(ASSET_PATHS.characters.player.idleDown).catch(() => null);
      
      // Load player animation frames for all directions (idle và walk)
      const playerTextures = {
        // Idle animations (chậm)
        idle: {
          down: await Promise.all(
            ASSET_PATHS.characters.player.idleDownFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          up: await Promise.all(
            ASSET_PATHS.characters.player.idleUpFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          left: await Promise.all(
            ASSET_PATHS.characters.player.idleLeftFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          right: await Promise.all(
            ASSET_PATHS.characters.player.idleRightFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
        },
        // Walk animations (nhanh hơn)
        walk: {
          down: await Promise.all(
            ASSET_PATHS.characters.player.walkDownFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          up: await Promise.all(
            ASSET_PATHS.characters.player.walkUpFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          left: await Promise.all(
            ASSET_PATHS.characters.player.walkLeftFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
          right: await Promise.all(
            ASSET_PATHS.characters.player.walkRightFrames.map(path => 
              PIXI.Assets.load(path).catch(() => null)
            )
          ).then(textures => textures.filter(t => t !== null) as PIXI.Texture[]),
        },
      };

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
      // LỚP 1: BACKGROUND - Floor với variation (Randomize tiles)
      // ============================================
      const mapWidth = GRID_WIDTH * TILE_SIZE;
      const mapHeight = GRID_HEIGHT * TILE_SIZE;

      // Tạo floor background với variation (randomize tiles để đa dạng)
      try {
        // Load floor variants để tạo variation
        const floorVariants = await Promise.all(
          ASSET_PATHS.tilesets.floorVariants.slice(0, 5).map(path => 
            PIXI.Assets.load(path).catch(() => null)
          )
        ).then(textures => textures.filter(t => t !== null && t !== PIXI.Texture.EMPTY) as PIXI.Texture[]);
        
        if (floorVariants.length > 0) {
          // Tạo floor container
          const floorContainer = new PIXI.Container();
          
          // Vẽ từng tile với random texture để tạo variation
          for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
              if (LEVEL_MAP[y] && LEVEL_MAP[y][x] === 0) {
                // Chọn texture từ variants (seed based on position để consistent)
                const seed = (x * 31 + y * 17) % floorVariants.length;
                const tileTexture = floorVariants[seed] || floorVariants[0];
                
                const floorTile = new PIXI.Sprite(tileTexture);
                floorTile.x = x * TILE_SIZE;
                floorTile.y = y * TILE_SIZE;
                floorTile.width = TILE_SIZE;
                floorTile.height = TILE_SIZE;
                floorContainer.addChild(floorTile);
              }
            }
          }
          
          worldContainer.addChild(floorContainer);
        } else if (floorTexture && floorTexture !== PIXI.Texture.EMPTY && floorTexture.baseTexture) {
          // Fallback: dùng single texture với TilingSprite
          const floorTilingSprite = new PIXI.TilingSprite(
            floorTexture,
            mapWidth,
            mapHeight
          );
          worldContainer.addChild(floorTilingSprite);
        } else {
          // Fallback: vẽ background bằng Graphics
          const bgGraphics = new PIXI.Graphics();
          bgGraphics.beginFill(0x1a1a2e);
          bgGraphics.drawRect(0, 0, mapWidth, mapHeight);
          bgGraphics.endFill();
          worldContainer.addChild(bgGraphics);
        }
      } catch (error) {
        console.error('Error creating floor tiles:', error);
        const bgGraphics = new PIXI.Graphics();
        bgGraphics.beginFill(0x1a1a2e);
        bgGraphics.drawRect(0, 0, mapWidth, mapHeight);
        bgGraphics.endFill();
        worldContainer.addChild(bgGraphics);
      }

      // ============================================
      // LỚP 2: WALLS/OBSTACLES - Duyệt LEVEL_MAP
      // ============================================
      const wallsContainer = new PIXI.Container();
      worldContainer.addChild(wallsContainer);

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (LEVEL_MAP[y] && LEVEL_MAP[y][x] === 1) {
            // Tạo sprite tường
            if (wallTexture && wallTexture !== PIXI.Texture.EMPTY && wallTexture.baseTexture) {
              try {
                const wallSprite = new PIXI.Sprite(wallTexture);
                wallSprite.x = x * TILE_SIZE;
                wallSprite.y = y * TILE_SIZE;
                wallSprite.width = TILE_SIZE;
                wallSprite.height = TILE_SIZE;
                wallsContainer.addChild(wallSprite);
              } catch (error) {
                console.error('Error creating wall sprite:', error);
                const wallGraphics = new PIXI.Graphics();
                wallGraphics.beginFill(0x2d2d44);
                wallGraphics.drawRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                wallGraphics.endFill();
                wallsContainer.addChild(wallGraphics);
              }
            } else {
              const wallGraphics = new PIXI.Graphics();
              wallGraphics.beginFill(0x2d2d44);
              wallGraphics.drawRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
              wallGraphics.endFill();
              wallsContainer.addChild(wallGraphics);
            }
          }
        }
      }

      // ============================================
      // LỚP 3: GAME OBJECTS (Mirrors, Chests, etc.)
      // ============================================
      const objectsContainer = new PIXI.Container();
      worldContainer.addChild(objectsContainer);

      gameObjectsRef.current.forEach((obj) => {
        if (!obj || obj.gridX === undefined || obj.gridY === undefined) {
          console.warn('Invalid game object:', obj);
          return;
        }

        let sprite: PIXI.Sprite | PIXI.Graphics | null = null;

        if (obj.type === "mirror") {
          if (mirrorTexture && mirrorTexture !== PIXI.Texture.EMPTY && mirrorTexture.baseTexture) {
            try {
              sprite = new PIXI.Sprite(mirrorTexture);
            } catch (error) {
              console.error('Error creating mirror sprite:', error);
              sprite = new PIXI.Graphics();
              (sprite as PIXI.Graphics).beginFill(0x9d4edd);
              (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
              (sprite as PIXI.Graphics).endFill();
            }
          } else {
            sprite = new PIXI.Graphics();
            (sprite as PIXI.Graphics).beginFill(0x9d4edd);
            (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
            (sprite as PIXI.Graphics).endFill();
          }
        } else if (obj.type === "chest") {
          if (chestTexture && chestTexture !== PIXI.Texture.EMPTY && chestTexture.baseTexture) {
            try {
              sprite = new PIXI.Sprite(chestTexture);
            } catch (error) {
              console.error('Error creating chest sprite:', error);
              sprite = new PIXI.Graphics();
              (sprite as PIXI.Graphics).beginFill(0xd4a574);
              (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
              (sprite as PIXI.Graphics).endFill();
            }
          } else {
            sprite = new PIXI.Graphics();
            (sprite as PIXI.Graphics).beginFill(0xd4a574);
            (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
            (sprite as PIXI.Graphics).endFill();
          }
        } else if (obj.type === "corpse") {
          // Skeleton texture
          if (skeletonTexture && skeletonTexture !== PIXI.Texture.EMPTY && skeletonTexture.baseTexture) {
            try {
              sprite = new PIXI.Sprite(skeletonTexture);
            } catch (error) {
              console.error('Error creating skeleton sprite:', error);
              sprite = new PIXI.Graphics();
              (sprite as PIXI.Graphics).beginFill(0x8b4513);
              (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
              (sprite as PIXI.Graphics).endFill();
            }
          } else {
            sprite = new PIXI.Graphics();
            (sprite as PIXI.Graphics).beginFill(0x8b4513);
            (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
            (sprite as PIXI.Graphics).endFill();
          }
        } else {
          // Fallback Graphics cho các object khác
          sprite = new PIXI.Graphics();
          if (obj.type === "door") {
            (sprite as PIXI.Graphics).beginFill(0x654321);
          } else {
            (sprite as PIXI.Graphics).beginFill(0x666666);
          }
          (sprite as PIXI.Graphics).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
          (sprite as PIXI.Graphics).endFill();
        }

        if (sprite) {
          sprite.x = obj.gridX * TILE_SIZE;
          sprite.y = obj.gridY * TILE_SIZE;
          sprite.width = TILE_SIZE;
          sprite.height = TILE_SIZE;
          objectsContainer.addChild(sprite);
        }
      });

      // ============================================
      // LỚP 4: PLAYER
      // ============================================
      const playerContainer = new PIXI.Container();
      worldContainer.addChild(playerContainer);

      // Khởi tạo visual position từ grid position
      const initialPixelPos = gridToPixel(gridPositionRef.current.x, gridPositionRef.current.y);
      visualPositionRef.current = { ...initialPixelPos };

      // Create player sprite with animation (bắt đầu với idle down)
      const initialIdleFrames = playerTextures.idle.down;
      
      // Validate textures trước khi tạo sprite
      const validFrames = validateTextures(initialIdleFrames);
      
      console.log('[initApp] Player textures loaded:', {
        totalFrames: initialIdleFrames.length,
        validFrames: validFrames.length,
      });
      
      let sprite: PIXI.Sprite | PIXI.AnimatedSprite | PIXI.Graphics;
      
      // Sử dụng helper function để tạo sprite an toàn
      if (validFrames.length > 1) {
        // Có nhiều frames - tạo AnimatedSprite
        const animSprite = createSafeAnimatedSprite(validFrames, {
          animationSpeed: 0.15,
          width: TILE_SIZE,
          height: TILE_SIZE,
        });
        
        if (animSprite) {
          sprite = animSprite;
          sprite.anchor.set(0.5);
          sprite.x = initialPixelPos.x;
          sprite.y = initialPixelPos.y;
          animSprite.play();
        } else {
          // Fallback to Graphics nếu không tạo được AnimatedSprite
          console.warn('[initApp] Failed to create AnimatedSprite, using Graphics fallback');
          sprite = new PIXI.Graphics();
          (sprite as PIXI.Graphics).beginFill(0xffb94a);
          (sprite as PIXI.Graphics).drawRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
          (sprite as PIXI.Graphics).endFill();
          sprite.x = initialPixelPos.x;
          sprite.y = initialPixelPos.y;
        }
      } else if (validFrames.length === 1) {
        // Single frame - use Sprite
        sprite = new PIXI.Sprite(validFrames[0]);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        sprite.anchor.set(0.5);
        sprite.x = initialPixelPos.x;
        sprite.y = initialPixelPos.y;
      } else {
        // No valid textures - fallback to Graphics
        console.warn('[initApp] No valid textures found, using Graphics fallback');
        sprite = new PIXI.Graphics();
        (sprite as PIXI.Graphics).beginFill(0xffb94a);
        (sprite as PIXI.Graphics).drawRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
        (sprite as PIXI.Graphics).endFill();
        sprite.x = initialPixelPos.x;
        sprite.y = initialPixelPos.y;
      }
      
      playerContainer.addChild(sprite);
      playerSpriteRef.current = sprite as PlayerSprite;
      
      // Store animation frames for direction changes (idle và walk) - chỉ khi có textures
      if (playerSpriteRef.current && initialIdleFrames.length > 0) {
        playerSpriteRef.current.textures = playerTextures;
        playerSpriteRef.current.currentDirection = 'down';
        console.log('[initApp] Player textures stored:', {
          idle: {
            down: playerTextures.idle.down.length,
            up: playerTextures.idle.up.length,
            left: playerTextures.idle.left.length,
            right: playerTextures.idle.right.length,
          },
          walk: {
            down: playerTextures.walk.down.length,
            up: playerTextures.walk.up.length,
            left: playerTextures.walk.left.length,
            right: playerTextures.walk.right.length,
          },
        });
      }
      
      // Fallback nếu không có texture
      if (!playerSpriteRef.current) {
        const fallback = new PIXI.Graphics();
        fallback.beginFill(0xffb94a);
        fallback.drawCircle(0, 0, TILE_SIZE / 2 - 2);
        fallback.endFill();
        fallback.x = initialPixelPos.x;
        fallback.y = initialPixelPos.y;
        playerContainer.addChild(fallback);
        playerSpriteRef.current = fallback;
      }

      // ============================================
      // CENTER CAMERA ON PLAYER (Khởi tạo)
      // ============================================
      const screenWidth = app.renderer?.width || containerWidth;
      const screenHeight = app.renderer?.height || containerHeight;
      
      if (camera && typeof camera.x !== 'undefined') {
        camera.x = -initialPixelPos.x + screenWidth / 2;
        camera.y = -initialPixelPos.y + screenHeight / 2;
      }

      // ============================================
      // SETUP TICKER (Smooth Movement)
      // ============================================
      setupTicker();

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
          if (cameraRef.current && visualPositionRef.current) {
            const playerX = visualPositionRef.current.x;
            const playerY = visualPositionRef.current.y;
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
        // Không cần destroy ticker vì nó thuộc về app và sẽ bị destroy cùng app
        tickerRef.current = null;
        app.destroy(true);
      };
    };

    initApp().catch(console.error);
  }, [gridToPixel, setupTicker]);

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
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
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
