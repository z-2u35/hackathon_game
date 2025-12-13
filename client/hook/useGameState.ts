import { useState } from "react";

export interface GameState {
  hp: number;
  oil: number;
  sanity: number;
  items: string[];
  codes: string[];
}

export function useGameState(initialState?: Partial<GameState>) {
  const [gameState, setGameState] = useState<GameState>({
    hp: initialState?.hp ?? 100,
    oil: initialState?.oil ?? 100,
    sanity: initialState?.sanity ?? 100,
    items: initialState?.items ?? [],
    codes: initialState?.codes ?? [],
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => {
      const newState = { ...prev };
      
      if (updates.hp !== undefined) {
        newState.hp = Math.max(0, Math.min(100, prev.hp + updates.hp));
      }
      if (updates.oil !== undefined) {
        newState.oil = Math.max(0, Math.min(100, prev.oil + updates.oil));
      }
      if (updates.sanity !== undefined) {
        newState.sanity = Math.max(0, Math.min(100, prev.sanity + updates.sanity));
      }
      if (updates.items) {
        newState.items = [...prev.items, ...updates.items];
      }
      if (updates.codes) {
        newState.codes = [...prev.codes, ...updates.codes];
      }

      return newState;
    });
  };

  const resetGameState = () => {
    setGameState({
      hp: initialState?.hp ?? 100,
      oil: initialState?.oil ?? 100,
      sanity: initialState?.sanity ?? 100,
      items: initialState?.items ?? [],
      codes: initialState?.codes ?? [],
    });
  };

  return {
    gameState,
    updateGameState,
    resetGameState,
  };
}

