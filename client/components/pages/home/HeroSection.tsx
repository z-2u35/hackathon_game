"use client";

import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import { ctaItems } from "./HomeCta_Items";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
        <HeroContent/>
      <div className="absolute inset-0 z-0 ">
        <div className="w-full h-full bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 border-t-2 border-amber-200 p-2 mt-2">
        <h1 className="text-4xl md:text-7xl font-pixel font-bold text-transparent bg-clip-text bg-linear-to-b from-amber-300 to-amber-700 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          Break the Lantern. Break the Loop.
        </h1>
        <p className="max-w-xl text-zinc-200">
          A roguelike dungeon crawler nơi ánh sáng là lời nguyền, và mọi bước chân đều đẩy bạn gần hơn đến sự thật Asteros đã cố giấu trong bóng tối.
        </p>

        <div className="flex gap-4 mt-4 flex-wrap justify-center">
          {ctaItems.map((btn, idx) => (
            <Button
              key={idx}
              onClick={() => router.push(btn.href)}
              className={`
                ${btn.style} 
                border-2 border-transparent 
                px-6 py-2 
                font-bold 
                cursor-pointer
                rounded-lg 
                transition-all duration-300 
                hover:border-amber-400 
                hover:bg-amber-600/30 
                hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-amber-500
              `}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
