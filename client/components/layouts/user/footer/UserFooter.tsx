/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Disclosure } from "@headlessui/react";
import { IconType } from "react-icons";

const PixelUserFooterBackground = dynamic(
  () => import("../background/PixelUserFootBackground"),
  { ssr: false }
);

import { FootItemsExtended } from "./FootItems";
type LogoItem = { type: "logo"; href: string; src: string };
type IconItem = { type: "icon"; href: string; icon: IconType };
type LinkItem = { label: string; href: string };
type FooterItem = LogoItem | IconItem | LinkItem;

export default function UserFooter() {
  return (
    <footer className="relative w-full min-h-55 z-10 bg-[#1E2130] border-t-2 border-[#7A84A2]">
      <PixelUserFooterBackground className="absolute bottom-0 left-0 w-full h-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-col gap-6">
        {/* Phần trên: map FootItems */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-12 w-full">
          {FootItemsExtended.map((section) => (
            <Disclosure key={section.title} defaultOpen>
              {({ open }: { open: boolean }) => (
                <div className="flex flex-col w-full md:flex-1 gap-2">
                  <Disclosure.Button
                    className="pixel-text text-red-100 text-[22px] font-bold flex justify-between md:justify-center w-full md:w-auto px-2 py-1 border-b md:border-none border-zinc-600
                     hover:text-white transition-all"
                    style={{
                      textShadow:
                        "2px 2px 0 #8b5e00, -2px -2px 0 #8b5e00, 2px -2px 0 #8b5e00, -2px 2px 0 #8b5e00",
                    }}
                  >
                    {section.title}
                    <span className="md:hidden">{open ? "▲" : "▼"}</span>
                  </Disclosure.Button>

                  <Disclosure.Panel
                    className={`flex flex-wrap gap-2 md:gap-2 mt-1 md:mt-0 justify-center transition-all duration-200 ${
                      open ? "flex" : "hidden md:flex"
                    }`}
                  >
                    {section.items.map((item: FooterItem) => {
                      // --- LOGO ---
                      if ("type" in item && item.type === "logo") {
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-center border-2 border-white bg-[#26293A] rounded-2xl px-3 py-1 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200"
                          >
                            <img
                              src={item.src}
                              alt="Logo ASTEROS"
                              className="
    h-10 md:h-12
    translate-y-1
    scale-110
    transition-transform duration-300
    hover:scale-125
  "
                            />
                          </Link>
                        );
                      }

                      // --- ICON (tách dòng riêng biệt) ---
                      if ("type" in item && item.type === "icon") {
                        const IconComp = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-center border-2 border-white bg-[#26293A] rounded-2xl px-3 py-1 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200"
                          >
                            <IconComp className="h-5 w-5 md:h-6 md:w-6 text-[#F0F2FA]" />
                          </Link>
                        );
                      }

                      // --- LINK THƯỜNG ---
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="pixel-text text-center border-2 border-white bg-[#26293A] rounded-2xl px-3 py-1 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200 text-[#F0F2FA] text-[20px]"
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Phần dưới: copyright */}
        <div className="pixel-text text-[#F0F2FA] text-[18px] mt-4 md:mt-6 text-left md:text-left">
          © {new Date().getFullYear()} ASTEROS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
