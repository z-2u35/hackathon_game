"use client";

import { useMemo } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/networkConfig";

export default function GameHUD() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  // Query owned objects filtered to Lantern struct type
  const { data, isLoading, isError } = useSuiClientQuery(
    "getOwnedObjects",
    {
      // use the address field as expected by the wrapper
      address: account?.address ?? null,
      limit: 20,
      // GraphQL / RPC filter for struct type
      filter: { StructType: `${packageId}::lantern::Lantern` },
    },
    { enabled: !!account?.address }
  );

  const lanternObjects = useMemo(() => {
    // data may be undefined while loading
    // shape: { objects: MoveObject[] }
    // fall back to empty array
    return (data && (data as any).objects) || [];
  }, [data]);

  if (!account) return null; // not connected

  if (isLoading) {
    return (
      <div className="w-full text-center text-zinc-400">Đang kiểm tra ví...</div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center text-red-400">Lỗi khi đọc dữ liệu Blockchain.</div>
    );
  }

  const hasLantern = lanternObjects.length > 0;

  // For this simple HUD we show live presence of a Lantern and the initial/default values
  // defined in the Move contract. Parsing BCS into fields is left as a future enhancement.
  const MAX_OIL = 100;
  const MAX_SANITY = 100;

  if (!hasLantern) {
    return null; // no lantern yet — parent page will render mint button
  }

  return (
    <div className="w-full max-w-sm bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-left">
      <h3 className="font-pixel text-xl text-amber-300 mb-3">TRẠNG THÁI NHÂN VẬT</h3>

      <div className="flex flex-col gap-2 text-sm text-zinc-200">
        <div className="flex justify-between">
          <span className="text-zinc-400">OIL</span>
          <span className="font-mono">{MAX_OIL}/{MAX_OIL}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">SANITY</span>
          <span className="font-mono">{MAX_SANITY}/{MAX_SANITY}</span>
        </div>

        <div className="flex justify-between mt-3">
          <span className="text-zinc-400">TRẠNG THÁI</span>
          <span className="font-medium text-green-400">CÒN SỐNG</span>
        </div>
      </div>
    </div>
  );
}
