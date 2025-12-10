"use client";

import HeroSection from "@/components/pages/home/HeroSection";
import IntroSection from "@/components/pages/home/IntroSection";
import GameplaySection from "@/components/pages/home/GameplaySection";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import CharacterSection from "@/components/pages/home/CharacterSection";
import NewsSection from "@/components/pages/home/NewsSection";
export default function Home() {
  return (
    <main className="flex flex-col gap-0 bg-zinc-950 text-white pixel-text overflow-hidden relative">
      {/* Hero Section với background và title */}
      <HeroSection />
      {/* HomeActionButton (nút login/mint) */}\{/* Các section khác */}
      <IntroSection />
      <GameplaySection />
      <FeaturesSection />
      <CharacterSection />
      <NewsSection />
    </main>
  );
}
