/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import DemoGameplay from "@/components/pages/gameplay/GameplayDemo";
import CoreLoop from "@/components/pages/gameplay/GameplayCoreLoop";
import LightSlider from "@/components/pages/gameplay/GameplayLightSlider";
import PlayerStats from "@/components/pages/gameplay/GameplayPlayerStats";
import CombatSystem from "@/components/pages/gameplay/GameplayCombatSystem";
import DungeonRooms from "@/components/pages/gameplay/GameplayDungeonRooms";
import TheLantern from "@/components/pages/gameplay/GameplayTheLantern";
import BlockchainFeatures from "@/components/pages/gameplay/GameplayBlockchainFeatures";

type FireParticle = {
  top: string;
  left: string;
  delay: string;
  x: number;
  y: number;
  size: number;
};

export default function DemoPage() {
  const sections = [
    CoreLoop,
    LightSlider,
    PlayerStats,
    CombatSystem,
    DungeonRooms,
    TheLantern,
    BlockchainFeatures,
  ];

  const [fires, setFires] = useState<FireParticle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3000}ms`,
      x: 50 + Math.random() * 250,
      y: 30 + Math.random() * 120,
      size: 1 + Math.random() * 2, // pixel nhỏ
    }));
    setFires(generated);
  }, []);

  return (
    <main className="relative p-6 mt-20 max-w-5xl mx-auto space-y-16 overflow-hidden">
      {/* Pixel Fire Particles */}
      {fires.map((fire, i) => (
        <div
          key={i}
          className="absolute bg-orange-400 opacity-90 animate-firePixel"
          style={{
            top: fire.top,
            left: fire.left,
            width: `${fire.size}px`,
            height: `${fire.size}px`,
            animationDelay: fire.delay,
            '--tx': `${fire.x}px`,
            '--ty': `${fire.y}px`,
          } as never}
        />
      ))}

      {/* DemoGameplay Hero */}
      <div className="mx-auto w-full text-center relative z-10 mt-20">
        <DemoGameplay />
      </div>

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {sections.map((Section, index) => (
          <div
            key={index}
            className="
              bg-zinc-800/80 
              p-6 
              rounded-2xl 
              border border-amber-100/20 
              shadow-lg 
              transition-all duration-300 ease-out
              hover:shadow-2xl 
              hover:scale-105 
              hover:border-amber-300/50 
              hover:bg-zinc-700/90
            "
          >
            <Section />
          </div>
        ))}
      </div>
    </main>
  );
}
