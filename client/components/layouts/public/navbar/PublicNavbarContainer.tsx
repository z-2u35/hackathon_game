// PublicNavbarContainer.tsx
"use client";

import React from "react";

export default function PublicNavbarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center bg-transparent">
      <div className="w-full max-w-5xl bg-[#1A1F2B] rounded-2xl border-2 border-white overflow-hidden px-4 py-1">
        {children}
      </div>
    </div>
  );
}
