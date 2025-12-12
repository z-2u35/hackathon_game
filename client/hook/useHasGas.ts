"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

const SUI_COIN_TYPE = "0x2::sui::SUI";

export function useHasGas() {
  const account = useCurrentAccount();

  const { data, isPending, isError, refetch } = useSuiClientQuery(
    "getCoins",
    {
      owner: account?.address ?? "",
      coinType: SUI_COIN_TYPE,
      limit: 1,
    },
    { enabled: !!account?.address }
  );

  const first = (data as any)?.data?.[0];
  const balanceStr: string | undefined = first?.balance;
  const hasGas = !!balanceStr && balanceStr !== "0";

  return {
    address: account?.address ?? null,
    hasGas,
    isLoading: isPending,
    isError,
    refetch,
  };
}