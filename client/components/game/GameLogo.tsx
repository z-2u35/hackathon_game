"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface GameLogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  showGlow?: boolean;
  animated?: boolean;
}

export default function GameLogo({ 
  className = "", 
  size = "large",
  showGlow = true,
  animated = true 
}: GameLogoProps) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Size mapping
  const sizeMap = {
    small: "w-24 h-24",
    medium: "w-32 h-32 md:w-40 md:h-40",
    large: "w-48 h-48 md:w-64 md:h-64",
    xlarge: "w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96",
  };

  // Try different logo paths (priority order)
  const logoPaths = [
    "/assets/ui/logo_asteros.png",
    "/assets/ui/game_logo.png",
    "/img/TeamLogo.png",
    "/assets/logo.png",
  ];

  const [currentLogoPath, setCurrentLogoPath] = useState(logoPaths[0]);

  useEffect(() => {
    // Try to load logo from different paths
    let currentIndex = 0;
    const tryLoadLogo = (index: number) => {
      if (index >= logoPaths.length) {
        setLogoError(true);
        return;
      }

      const path = logoPaths[index];
      const img = new window.Image();
      
      img.onload = () => {
        setCurrentLogoPath(path);
        setLogoLoaded(true);
        setLogoError(false);
      };
      
      img.onerror = () => {
        // Try next path
        tryLoadLogo(index + 1);
      };
      
      img.src = path;
    };
    
    tryLoadLogo(0);
  }, []);

  // If logo not found or not loaded yet, show text logo
  if (logoError || !logoLoaded) {
    return (
      <div className={`${className} flex items-center justify-center ${sizeMap[size]}`}>
        <div
          className={`font-pixel text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] ${
            animated ? "animate-pulse" : ""
          } ${
            size === "small" ? "text-2xl" :
            size === "medium" ? "text-3xl md:text-4xl" :
            size === "large" ? "text-4xl md:text-5xl lg:text-6xl" :
            "text-5xl md:text-6xl lg:text-7xl"
          }`}
          style={
            showGlow
              ? {
                  textShadow: `
                    0 0 10px rgba(251, 191, 36, 0.8),
                    0 0 20px rgba(251, 191, 36, 0.6),
                    0 0 30px rgba(251, 191, 36, 0.4),
                    2px 2px 0px rgba(0, 0, 0, 0.8),
                    -2px -2px 0px rgba(0, 0, 0, 0.8)
                  `,
                }
              : {}
          }
        >
          ASTEROS
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative ${sizeMap[size]}`}>
      <div className="relative w-full h-full">
        <Image
          src={currentLogoPath}
          alt="ASTEROS Logo"
          fill
          className={`object-contain ${animated ? "animate-pulse" : ""}`}
          priority
          onError={() => setLogoError(true)}
        />
        {showGlow && (
          <div
            className="absolute inset-0 opacity-50 blur-xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

