"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Transition } from "@headlessui/react";

interface AuthLoginAreaProps {
  account: ReturnType<typeof useCurrentAccount>;
}

export default function AuthLoginArea({ account }: AuthLoginAreaProps) {
  return (
    <div className="w-full flex justify-center py-4">
      <Transition
        appear
        show={true}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        {account ? (
          <div className="flex flex-col  items-center animate-pulse">
            <div className="text-green-400 font-pixel text-2xl mb-4 border-2 border-green-500 px-6 py-3 rounded bg-green-900/20">
              SUCCESS!
            </div>
            <p className="text-zinc-500 font-body text-lg">Đang chuyển hướng...</p>
          </div>
        ) : (
          <div className="scale-125  custom-connect-wrapper transition-transform hover:scale-130">
            <ConnectButton className="cursor-pointer" connectText="Login with Wallet / Google" />
          </div>
        )}
      </Transition>
    </div>
  );
}
