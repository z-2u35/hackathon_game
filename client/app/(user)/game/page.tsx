"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Disclosure } from "@headlessui/react";

export default function GamePage() {
  const search = useSearchParams();
  const tx = search?.get("tx");
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="max-w-xl w-full border-4 border-zinc-800 bg-zinc-900/90 p-8 rounded-xl text-center flex flex-col gap-6">

        <h1 className="font-pixel text-4xl text-amber-400 mb-4">Welcome to Asteros</h1>
        <p>Bạn đã tạo nhân vật thành công. Đây là trang chơi tạm thời.</p>

        {account && (
          <Disclosure defaultOpen>
            {({ }) => (
              <>
                <Disclosure.Button className="w-full text-left px-4 py-2 bg-zinc-800 rounded-md font-pixel hover:bg-zinc-700/80">
                  Ví: {account.address}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-2 text-zinc-400 wrap-break-word">
                  {account.address}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )}

        {tx ? (
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full text-left px-4 py-2 bg-zinc-800 rounded-md font-pixel hover:bg-zinc-700/80">
                  Transaction {open ? "▲" : "▼"}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-2 text-xs text-zinc-400 bg-black/60 rounded wrap-break-word">
                  {tx}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ) : (
          <div className="text-zinc-500">Không có transaction digest để hiển thị.</div>
        )}

        <div className="flex gap-3 justify-center mt-4">
          <Link href="/" className="px-4 py-2 bg-amber-600 rounded font-pixel">Về trang chủ</Link>
          <Link href="/auth" className="px-4 py-2 bg-zinc-700 rounded font-pixel">Đăng nhập lại</Link>
        </div>
      </div>
    </div>
  );
}
