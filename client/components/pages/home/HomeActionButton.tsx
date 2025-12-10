// components/home/HomeActionButton.tsx
"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import StartGameButton from "./StartGameButton";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

export default function HomeActionButton() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const { data: lanternData, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: `${packageId}::lantern::Lantern` },
      options: { showContent: true },
    },
    { enabled: !!account }
  );

  const hasLantern = (lanternData?.data?.length ?? 0) > 0;

  return (
    <Disclosure defaultOpen>
      {() => (
        <div className="border-2 border-amber-200 rounded-2xl p-3">
          <Disclosure.Button className="font-pixel text-lg px-6 py-2 rounded-md bg-amber-600/30 border border-amber-500 hover:bg-amber-500/50 transition-all">
            {account
              ? !hasLantern
                ? "Mint đèn để bắt đầu"
                : "Đã đăng nhập – vào User để chơi"
              : "Kết nối ví để chơi"}
          </Disclosure.Button>

          <Disclosure.Panel className="mt-4 flex flex-col items-center gap-4">
            {!account ? (
              <Link
                href="/auth"
                className="font-pixel text-sm bg-[#D4A94E] text-black py-4 px-10 rounded border-b-4 border-[#b45309] hover:bg-[#fbbf24] active:translate-y-1 transition-all"
              >
                LOGIN SYSTEM
              </Link>
            ) : !hasLantern ? (
              <>
                <StartGameButton />
                <button
                  onClick={() => refetch()}
                  className="mt-2 text-xs text-zinc-500 hover:text-white underline font-mono"
                >
                  ⟳ Làm mới dữ liệu
                </button>
              </>
            ) : (
              <p className="text-zinc-400 mt-2">
                Bạn đã đăng nhập. Vui lòng vào trang User để chơi.
              </p>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
