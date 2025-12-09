"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { navItems } from "./NavItems";
// Import các hook từ Sui dApp Kit
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit"; 

const PixelNavbarBackground = dynamic(
  () => import("../background/PixelNavbarBackground"),
  { ssr: false }
);

export default function PublicNavbar() {
  const account = useCurrentAccount(); // Kiểm tra xem đã kết nối ví chưa
  const { mutate: disconnect } = useDisconnectWallet(); // Hàm đăng xuất

  return (
    <header className="relative w-full z-30 ">
      <PixelNavbarBackground />

      <Disclosure as="nav" className="relative z-10 bg-transparent">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex h-20 items-center justify-between">
                
                {/* --- 1. LOGO --- */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#26293A] border-2 border-[#7A84A2] pixel-border rounded-full">
                    <div className="w-12 h-12 pixel-text text-[#D4A94E] text-[25px] select-none flex items-center justify-center">
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

                {/* --- 2. DESKTOP MENU --- */}
                <div className="hidden md:flex items-center gap-6 border-2 border-white rounded-2xl p-1.5 m-1">
                  {/* Menu Items */}
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

                  {/* --- LOGIC NÚT ĐĂNG NHẬP / ĐĂNG XUẤT (DESKTOP) --- */}
                  <div>
                    {account ? (
                      // TRẠNG THÁI: ĐÃ ĐĂNG NHẬP (Hiện ví + nút Logout)
                      <div className="flex items-center gap-2 m-2">
                        {/* Hiển thị địa chỉ ví */}
                        <div className="pixel-text bg-[#1E2130] text-[#50fa7b] font-bold px-4 py-2 rounded-sm border-2 border-[#50fa7b] shadow-md select-none text-[20px]">
                          {account.address.slice(0, 5)}...{account.address.slice(-4)}
                        </div>
                        
                        {/* Nút Đăng Xuất (Logout) */}
                        <button
                          onClick={() => disconnect()}
                          className="bg-[#FF5555] hover:bg-[#ff0000] text-white border-2 border-[#990000] p-2 rounded-sm shadow-md active:translate-y-1 transition-all"
                          title="Đăng xuất"
                        >
                          <ArrowRightOnRectangleIcon className="w-7 h-7" />
                        </button>
                      </div>
                    ) : (
                      // TRẠNG THÁI: CHƯA ĐĂNG NHẬP (Hiện nút Login -> Link sang /auth)
                      <Link
                        href="/auth"
                        className="pixel-text bg-[#D4A94E] m-3 text-black font-bold px-6 py-2 rounded-sm border-2 border-[#FFD700] shadow-md hover:shadow-lg hover:bg-[#FFD700] hover:-translate-y-1 transition-all duration-200 text-[25px] inline-block"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>

                {/* --- 3. MOBILE TOGGLE --- */}
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

            {/* --- 4. MOBILE MENU --- */}
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
                
                {/* --- LOGIC ĐĂNG NHẬP / ĐĂNG XUẤT (MOBILE) --- */}
                <div className="pt-2 border-t border-zinc-600">
                  {account ? (
                    <div className="space-y-3">
                       <div className="pixel-text block w-full text-center bg-[#1E2130] text-[#50fa7b] border border-[#50fa7b] rounded-xl px-4 py-3 font-bold text-[20px]">
                          Ví: {account.address.slice(0, 5)}...
                       </div>
                       <button
                          onClick={() => disconnect()}
                          className="pixel-text w-full text-center bg-[#FF5555] active:bg-[#ff0000] text-white border-2 border-[#990000] rounded-xl px-4 py-3 font-bold shadow-md text-[20px]"
                       >
                          Đăng xuất
                       </button>
                    </div>
                  ) : (
                    <Disclosure.Button
                      as={Link}
                      href="/auth"
                      className="pixel-text block w-full text-center bg-[#D4A94E] text-black rounded-xl px-4 py-3 font-bold shadow-md hover:shadow-lg transition-all duration-200 text-[25px]"
                    >
                      Login
                    </Disclosure.Button>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
}