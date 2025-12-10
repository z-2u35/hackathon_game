"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Disclosure } from "@headlessui/react";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions";
import { useNetworkVariable } from "@/app/providers/networkConfig";
export default function UserPage() {
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
  const lanternId = hasLantern
    ? lanternData?.data?.[0]?.data?.objectId ?? null
    : null;

  if (!account) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white **:font-pixel">
      <Disclosure defaultOpen>
        {() => (
          <>
            <Disclosure.Button className="px-6 py-3 mb-4 bg-amber-700/30 cursor-pointer rounded-md border border-amber-500 hover:bg-amber-600/50 transition-all">
              {hasLantern ? "Nhân vật đã sẵn sàng" : "Bạn chưa có nhân vật?"}
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col items-center gap-6">
              {hasLantern && lanternId ? (
                <>
                  <GameHUD />
                  <GameActions
                    lanternId={lanternId}
                    onSuccess={() => setTimeout(() => refetch(), 1000)}
                  />
                </>
              ) : (
                <p className="text-zinc-400 mt-4">
                  Bạn chưa có nhân vật, hãy mint để bắt đầu.
                </p>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
