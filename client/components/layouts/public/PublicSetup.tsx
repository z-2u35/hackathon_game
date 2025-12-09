// PublicSetup.tsx
"use client";

import PublicNavbar from "@/components/layouts/public/navbar/PublicNavbar";
import PublicNavbarContainer from "./navbar/PublicNavbarContainer";
import PublicFooter from "@/components/layouts/public/footer/PublicFooter";

export default function PublicSetup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen text-[#E9ECF2] flex flex-col">
      {/* Navbar */}
      <PublicNavbarContainer>
        <PublicNavbar />
      </PublicNavbarContainer>

      {/* Main content */}
      <main className="relative z-10 flex-1 ">{children}</main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
