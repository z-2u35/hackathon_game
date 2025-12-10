// PublicSetup.tsx
"use client";

import UserNavbar from "@/components/layouts/user/navbar/UserNavbar";
import UserNavbarContainer from "./navbar/UserNavbarContainer";
import UserFooter from "./footer/UserFooter";

export default function UserSetup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col text-[#E9ECF2] bg-black overflow-x-hidden">
      {/* Navbar */}
      <UserNavbarContainer>
        <UserNavbar />
      </UserNavbarContainer>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4">
        {children}
      </main>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
