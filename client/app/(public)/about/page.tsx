/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/pages/about/AboutHeroSection";
import EraOfFalseLight from "@/components/pages/about/AboutEraOfFalseLight";
import TheFallenLantern from "@/components/pages/about/AboutTheFallenLantern";
import TheGreatCollapse from "@/components/pages/about/AboutTheGreatCollapse";
import EclipsedPit from "@/components/pages/about/AboutEclipsedPit";
import LanternNature from "@/components/pages/about/AboutLanternNature";
import TheSeeker from "@/components/pages/about/AboutTheSeeker";
import JourneyGoal from "@/components/pages/about/AboutJourneyGoal";
import AboutUs from "@/components/pages/about/AboutUs";
import { useReveal } from "@/hook/effect/useReveal";

type Star = {
  top: string;
  left: string;
  delay: string;
  x: number;
  y: number;
};

// Component con cho scroll reveal
function RevealSection({ children }: { children: React.ReactNode }) {
  const { ref, show } = useReveal();

  return (
    <div
      ref={ref}
      className={`
        bg-zinc-800/80
        p-6
        rounded-2xl
        border border-amber-100/20
        shadow-lg
        transition-all duration-700 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        hover:shadow-2xl
        hover:scale-105
        hover:border-amber-300/50
        hover:bg-zinc-700/90
      `}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const sections = [
    EraOfFalseLight,
    TheFallenLantern,
    TheGreatCollapse,
    LanternNature,
    TheSeeker,
    JourneyGoal,
  ];

  const [stars, setStars] = useState<Star[]>([]);

  // Tạo stars một lần khi component mount
  useEffect(() => {
    const generated = Array.from({ length: 10 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3000}ms`,
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    }));
    setStars(generated);
  }, []);

  return (
    <main className="relative p-6 mt-30 text-justify max-w-5xl mx-auto space-y-16 overflow-hidden">
      {/* Shooting stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-shootingStar"
          style={
            {
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              "--tx": `${star.x}px`,
              "--ty": `${star.y}px`,
            } as never
          }
        />
      ))}

      {/* HeroSection với fadeInUp */}
      <RevealSection>
        <div className="mx-auto w-full text-center relative z-10 animate-fadeInUp">
          <HeroSection />
        </div>
      </RevealSection>

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {sections.map((Section, index) => (
          <RevealSection key={index}>
            <Section />
          </RevealSection>
        ))}
      </div>

      {/* EclipsedPit full-width */}
      <RevealSection>
        <EclipsedPit />
      </RevealSection>

      {/* AboutUs full-width */}
      <RevealSection>
        <AboutUs />
      </RevealSection>
    </main>
  );
}
