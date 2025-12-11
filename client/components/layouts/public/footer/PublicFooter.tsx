"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Disclosure } from "@headlessui/react";

const PixelFooterBackground = dynamic(
  () => import("../background/PixelFooterBackground"),
  { ssr: false }
);

import { FootItems } from "./FootItems";

export default function PublicFooter() {
  return (
    <footer className="relative w-full min-h-[200px] z-10 bg-[#1E2130] border-t-2 border-[#7A84A2]">
      <PixelFooterBackground className="absolute bottom-0 left-0 w-full h-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-5 md:gap-12 w-full">
          {FootItems.map((section) => (
            <Disclosure key={section.title} defaultOpen>
              {({ open }) => (
                <div className="flex flex-col w-full md:flex-1 gap-2">
                  <Disclosure.Button className="pixel-text text-[#C7B4FF] text-[22px] font-bold flex justify-between md:justify-center w-full md:w-auto px-2 py-1 border-b md:border-none border-zinc-600 hover:text-amber-400 transition-all">
                    {section.title}
                    <span className="md:hidden">{open ? "▲" : "▼"}</span>
                  </Disclosure.Button>

                  <Disclosure.Panel
                    className={`flex flex-wrap gap-2 md:gap-2 mt-1 md:mt-0 justify-center transition-all duration-200 ${
                      open ? "flex" : "hidden md:flex"
                    }`}
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="pixel-text text-center border-2 border-white bg-[#26293A] rounded-2xl px-3 py-1 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200 text-[#F0F2FA] text-[20px]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        <div className="pixel-text text-[#F0F2FA] text-[18px] mt-4 md:mt-0 text-center md:text-right">
          © {new Date().getFullYear()} ASTEROS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
