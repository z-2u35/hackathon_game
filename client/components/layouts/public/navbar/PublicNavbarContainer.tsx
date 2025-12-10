// PublicNavbarContainer.tsx
"use client";

import React from "react";

export default function PublicNavbarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex justify-center z-20 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl bg-[#1A1F2B] rounded-2xl border-2  border-white overflow-hidden px-0.5 py-1 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
