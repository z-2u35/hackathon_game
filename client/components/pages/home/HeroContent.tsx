// components/HeroContent.tsx
"use client";

import HomeActionButton from "./HomeActionButton";

export default function HeroContent() {
  return (
    <div className="z-10 text-center flex flex-col items-center gap-6 w-full px-4 py-12">
      <h1 className="text-5xl md:text-9xl font-pixel font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-amber-300 to-amber-700 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
        ASTEROS
      </h1>
      <HomeActionButton />
      
    </div>
  );
}
