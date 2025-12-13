// PublicSetup.tsx
"use client";

import CommonNavbar from "@/components/layouts/common/CommonNavbar";
import PublicNavbarContainer from "@/components/layouts/public/navbar/PublicNavbarContainer";
import PublicBackground from "@/components/layouts/public/background/PublicBackground";

export default function PublicSetup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative pixel-text min-h-screen text-[#E9ECF2] flex flex-col">
      {/* Navbar */}
      <PublicNavbarContainer>
        <CommonNavbar />
      </PublicNavbarContainer>

      {/* Main content */}
      <main className="relative z-10 flex-1">
        <PublicBackground>{children}</PublicBackground>
      </main>
    </div>
  );
}
