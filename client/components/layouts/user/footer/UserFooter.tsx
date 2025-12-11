"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Disclosure } from "@headlessui/react";

const PixelUserFooterBackground = dynamic(
  () => import("../background/PixelUserFootBackground"),
  { ssr: false }
);

import { FootItems } from "./FootItems";

export default function UserFooter() {
  return (
    <footer className="relative w-full z-10 bg-[#1E1400] border-t-2 border-amber-500">
      <PixelUserFooterBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        {/* Footer links mapping theo section */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-12 w-full md:w-auto">
          {FootItems.map((section) => (
            <Disclosure key={section.title} defaultOpen>
              {({ open }) => (
                <div className="flex flex-col w-full md:flex-1 gap-2">
                  <Disclosure.Button className="pixel-text text-amber-400 text-[22px] font-bold flex justify-between md:justify-center w-full md:w-auto px-2 py-1 border-b md:border-none border-zinc-600 hover:text-amber-300 transition-all">
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
                        className="pixel-text text-center border-2 border-amber-500 bg-[#2E1B00] rounded-2xl px-3 py-1 hover:bg-amber-500/20 hover:shadow-lg transition-all duration-200 text-amber-100 text-[20px]"
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

        {/* Copyright */}
        <div className="pixel-text text-amber-100 text-[18px] mt-4 md:mt-0 text-center md:text-right">
          © {new Date().getFullYear()} ASTEROS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
