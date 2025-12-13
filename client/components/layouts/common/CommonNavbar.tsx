"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const PixelNavbarBackground = dynamic(
  () => import("@/components/layouts/public/background/PixelNavbarBackground"),
  { ssr: false }
);

export default function CommonNavbar() {
  const router = useRouter();

  return (
    <header className="relative w-full z-30 m-2 ml-6">
      <PixelNavbarBackground />

      <Disclosure as="nav" className="relative z-10 bg-transparent">
        {({ open }: { open: boolean }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex h-20 items-center justify-between">
                {/* Left: Back button + Logo */}
                <div className="flex items-center gap-4">
                  {/* Back button */}
                
                  {/* Logo */}
                  <div className="w-16 h-16 flex items-center justify-center bg-[#26293A] border-2 border-[#7A84A2] pixel-border rounded-full">
                    <div className="w-12 h-12 pixel-text text-[#D4A94E] text-[25px] select-none">
                      A
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="relative inline-block text-[55px] font-bold font-pixel tracking-wider text-transparent hover:text-[#C7B4FF] transition-all"
                  >
                    ASTEROS
                    <span className="absolute top-0 left-0 w-full h-full text-[#F0F2FA]">
                      ASTEROS
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full text-red-400 opacity-70 animate-glitch-sm1">
                      ASTEROS
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full text-blue-400 opacity-70 animate-glitch-sm2">
                      ASTEROS
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full text-white opacity-80 animate-glitch-sm3">
                      ASTEROS
                    </span>
                  </Link>

                    <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-12 h-12
             bg-[#26293A] border-2 border-[#7A84A2]
             rounded-none pixel-border cursor-pointer
             hover:bg-[#C7B4FF]/20 transition-all"
                    aria-label="Quay lại"
                  >
                    <ArrowLeftIcon className="w-6 h-6 text-[#F0F2FA]" />
                  </button>

                </div>

                {/* Desktop menu */}

                {/* Mobile toggle */}
                <div className="md:hidden flex items-center">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md bg-[#26293A] border border-[#7A84A2]/30">
                    {open ? (
                      <XMarkIcon className="h-6 w-6 text-[#F0F2FA]" />
                    ) : (
                      <Bars3Icon className="h-6 w-6 text-[#F0F2FA]" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
          </>
        )}
      </Disclosure>

      <style jsx>{`
        @keyframes glitch-sm1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-1px, -1px);
          }
          40% {
            transform: translate(1px, 1px);
          }
          60% {
            transform: translate(-1px, 1px);
          }
          80% {
            transform: translate(1px, -1px);
          }
        }
        @keyframes glitch-sm2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(1px, 1px);
          }
          40% {
            transform: translate(-1px, -1px);
          }
          60% {
            transform: translate(1px, -1px);
          }
          80% {
            transform: translate(-1px, 1px);
          }
        }
        @keyframes glitch-sm3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(0, -1px);
          }
          40% {
            transform: translate(0, 1px);
          }
          60% {
            transform: translate(-1px, 0);
          }
          80% {
            transform: translate(1px, 0);
          }
        }
        .animate-glitch-sm1 {
          animation: glitch-sm1 1.5s infinite;
        }
        .animate-glitch-sm2 {
          animation: glitch-sm2 1.7s infinite;
        }
        .animate-glitch-sm3 {
          animation: glitch-sm3 2s infinite;
        }
      `}</style>
    </header>
  );
}
