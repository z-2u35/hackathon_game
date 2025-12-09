"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Pixel dungeon background cho footer
const PixelFooterBackground = dynamic(
  () => import("../background/PixelFooterBackground"),
  { ssr: false }
);

import { FootItems } from "./FootItems";


export default function PublicFooter() {
  return (
    <footer className="relative w-full z-10 bg-[#1E2130] border-t-2 border-[#7A84A2]">
      {/* Background dungeon pixel */}
      <PixelFooterBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        {/* Footer links mapping theo section */}
        <div className="flex flex-wrap gap-5 md:gap-12">
          {FootItems.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <span className="pixel-text text-center text-[#C7B4FF] text-[22px] font-bold">
                {section.title}
              </span>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="pixel-text text-center border-2 border-white bg-[#26293A] rounded-2xl px-3 py-1 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200 text-[#F0F2FA] text-[20px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pixel-text text-[#F0F2FA] text-[18px] mt-4 md:mt-0">
          © {new Date().getFullYear()} ASTEROS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
