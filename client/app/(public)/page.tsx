"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import StartGameButton from "@/components/game/StartGameButton"; 
import { useNetworkVariable } from "@/app/providers/networkConfig";

export default function Home() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const { data: lanternData, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: `${packageId}::lantern::Lantern` },
      options: { showContent: true }
    },
    { enabled: !!account }
  );

  const hasLantern = (lanternData?.data?.length ?? 0) > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-900/20 via-black to-black z-0"></div>

      <div className="z-10 text-center flex flex-col items-center gap-6 w-full px-4 py-12">
        <h1 className="text-5xl md:text-8xl font-pixel font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-amber-300 to-amber-700 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          ASTEROS
        </h1>

        <Disclosure defaultOpen>
          {({ }) => (
            <>
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
                  <p className="text-zinc-400 mt-2">Bạn đã đăng nhập. Vui lòng vào trang User để chơi.</p>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
