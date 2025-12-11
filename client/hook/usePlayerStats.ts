// hook/usePlayerStats.ts
"use client";

import { useMemo } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

interface SuiObjectResponse {
  data: {
    objectId: string;
    type: string;
    content?: {
      fields?: {
        hp?: number;
        sanity?: number;
        oil?: number;
      };
    };
  };
}

interface GetOwnedObjectsResponse {
  data: SuiObjectResponse[];
}

export function usePlayerStats() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const { data, isLoading, isError, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address ?? "",
      limit: 20,
      filter: { StructType: `${packageId}::lantern::Lantern` },
    },
    { enabled: !!account?.address }
  );

  const lanternObjects = useMemo<SuiObjectResponse[]>(() => {
    if (!data || typeof data !== "object") return [];
    const d = data as GetOwnedObjectsResponse;
    return Array.isArray(d.data) ? d.data : [];
  }, [data]);

  const hasLantern = lanternObjects.length > 0;

  const lanternId = lanternObjects[0]?.data.objectId ?? null;

  // Lấy thông số cơ bản nếu có content.fields
  const hp = lanternObjects[0]?.data.content?.fields?.hp ?? 100;
  const sanity = lanternObjects[0]?.data.content?.fields?.sanity ?? 100;
  const oil = lanternObjects[0]?.data.content?.fields?.oil ?? 100;

  const MAX_OIL = 100;
  const MAX_SANITY = 100;

  return {
    account,
    isLoading,
    isError,
    lanternObjects,
    hasLantern,
    lanternId,
    hp,
    sanity,
    oil,
    MAX_OIL,
    MAX_SANITY,
    refetch,
  };
}
