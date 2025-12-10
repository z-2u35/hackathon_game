"use client";

import { useMemo } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

// Định nghĩa kiểu MoveObject cơ bản
interface MoveObject {
  data: {
    objectId: string;
    // thêm các field nếu cần
  };
}

// Kiểu dữ liệu query
interface LanternQueryData {
  objects: MoveObject[];
}

export default function GameHUD() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  // Query owned objects filtered to Lantern struct type
  const { data, isLoading, isError } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address ?? "", // dùng owner thay vì address
      limit: 20,
      filter: { StructType: `${packageId}::lantern::Lantern` },
    },
    { enabled: !!account?.address }
  );

  // Lấy danh sách lantern objects an toàn, tránh any
  const lanternObjects = useMemo(() => {
    if (!data || typeof data !== "object" || !("objects" in data)) return [];
    return (data as LanternQueryData).objects ?? [];
  }, [data]);

  if (!account) return null; // chưa kết nối ví

  if (isLoading) {
    return (
      <div className="w-full text-center text-zinc-400 font-pixel">
        Đang kiểm tra ví...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center text-red-400 font-pixel">
        Lỗi khi đọc dữ liệu Blockchain.
      </div>
    );
  }

  const hasLantern = lanternObjects.length > 0;

  const MAX_OIL = 100;
  const MAX_SANITY = 100;

  if (!hasLantern) {
    return null; // chưa mint lantern
  }

  return (
    <div className="w-full max-w-sm bg-zinc-900/70 border border-zinc-800 p-6 rounded-md text-left font-pixel **:font-pixel">
      <h3 className="text-xl text-amber-300 mb-3">TRẠNG THÁI NHÂN VẬT</h3>

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
