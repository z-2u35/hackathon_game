"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { navItems } from "./NavItems";

const PixelNavbarBackground = dynamic(
  () => import("../background/PixelNavbarBackground"),
  { ssr: false }
);

export default function PublicNavbar() {
  return (
    <header className="relative w-full z-30 ">
      <PixelNavbarBackground />

      <Disclosure as="nav" className="relative z-10 bg-transparent">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex h-20 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#26293A] border-2 border-[#7A84A2] pixel-border rounded-full">
                    <div className="w-12 h-12 pixel-text text-[#D4A94E] text-[25px] select-none">
                      A
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="pixel-text text-[#F0F2FA] text-[25px] font-bold tracking-wider hover:text-[#C7B4FF] transition-all"
                  >
                    ASTEROS
                  </Link>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-6 border-2 border-white rounded-2xl p-1.5 m-1">
                  <div className="flex items-center gap-3 bg-[#1E2130]/50 backdrop-blur-md rounded-3xl px-4 ">
                    {navItems.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="pixel-text border-2 border-white bg-[#26293A] rounded-2xl px-3 py-2 hover:bg-[#C7B4FF]/20 hover:shadow-lg transition-all duration-200 text-[#F0F2FA] text-[25px]"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>

                  {/* Login button */}
                  <div>
                    <Link
                      href="/auth"
                      className="pixel-text bg-[#D4A94E] m-3 text-black font-bold px-6 py-2 rounded-sm border-2 border-[#FFD700] shadow-md hover:shadow-lg transition-all duration-200 text-[25px]"
                    >
                      Login
                    </Link>
                  </div>
                </div>

                {/* Mobile menu toggle */}
                <div className="md:hidden flex items-center">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md bg-[#26293A] border border-[#7A84A2]/30">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6 text-[#F0F2FA]" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6 text-[#F0F2FA]" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="md:hidden bg-[#1E2130] border-t border-[#7A84A2]/40">
              <div className="px-4 pt-4 pb-3 space-y-3">
                {navItems.map((it) => (
                  <Disclosure.Button
                    key={it.href}
                    as={Link}
                    href={it.href}
                    className="pixel-text block w-full text-left bg-[#26293A] rounded-xl px-4 py-3 hover:bg-[#C7B4FF]/20 transition-all duration-200 text-[#F0F2FA] text-[25px]"
                  >
                    {it.label}
                  </Disclosure.Button>
                ))}
                <Disclosure.Button
                  as={Link}
                  href="/auth"
                  className="pixel-text block w-full text-center bg-[#D4A94E] text-black rounded-xl px-4 py-3 font-bold shadow-md hover:shadow-lg transition-all duration-200 text-[25px]"
                >
                  Login
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
}
