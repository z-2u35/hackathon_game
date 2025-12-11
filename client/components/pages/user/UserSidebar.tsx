"use client";

import { Disclosure } from "@headlessui/react";
import StartGameButton from "@/components/pages/user/StartGameButton";

interface Props {
  hasLantern: boolean;
}

export default function UserSidebar({ hasLantern }: Props) {
  return (
    <aside className="w-50 border-r border-amber-500 p-4 flex flex-col mt-24">
      <Disclosure defaultOpen>
        {() => (
          <div className="border-2 border-amber-400 p-3 mr-9 rounded-xl">
            <Disclosure.Button
              className={`w-full text-center px-4 py-4 text-[15px] cursor-pointer mb-6 border rounded-lg transition-colors font-semibold
    ${
      hasLantern
        ? "bg-green-600/70 border-green-500 hover:bg-green-500"
        : "bg-amber-700/30 border-amber-500 hover:bg-amber-600/50"
    }`}
            >
              {hasLantern ? "Nhân vật đã sẵn sàng" : "Bạn chưa có nhân vật?"}
            </Disclosure.Button>

            <Disclosure.Panel className="flex flex-col items-center gap-6 w-full">
              {!hasLantern ? (
                <>
                  <p className="text-zinc-400 text-center">
                    Bạn chưa có nhân vật, hãy mint để bắt đầu.
                  </p>
                  <StartGameButton />
                </>
              ) : null}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </aside>
  );
}
