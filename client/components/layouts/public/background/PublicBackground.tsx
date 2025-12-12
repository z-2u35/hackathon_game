"use client";

import { ReactNode } from "react";

interface PublicBackgroundProps {
  children: ReactNode;
}

export default function PublicBackground({ children }: PublicBackgroundProps) {
  return (
    <div className="relative flex flex-col gap-0 text-white pixel-text overflow-hidden min-h-screen bg-zinc-950">
      {/* Nội dung chính */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
