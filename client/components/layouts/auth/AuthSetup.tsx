// AuthSetup.tsx
"use client";

export default function AuthSetup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative font-pixel min-h-screen flex flex-col text-[#E9ECF2] bg-black overflow-x-hidden">
      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4">
        {children}
      </main>
    </div>
  );
}
