import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

/**
 * Hook để lấy số dư SUI (gas) của ví hiện tại
 * @returns Số dư SUI (đã convert từ MIST), loading state, và error state
 */
export function useWalletBalance() {
  const account = useCurrentAccount();

  const { data: balance, isLoading, isError, refetch } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address || "",
      coinType: "0x2::sui::SUI",
    },
    {
      enabled: !!account?.address,
      refetchInterval: 10000, // Refetch mỗi 10 giây để cập nhật số dư
    }
  );

  // Convert từ MIST sang SUI (1 SUI = 10^9 MIST)
  const suiBalance = balance ? Number(balance.totalBalance) / 1e9 : 0;
  // Format số với 4 chữ số thập phân
  const formattedBalance = suiBalance.toFixed(4);
  // Format ngắn gọn hơn cho UI (chỉ 2 chữ số thập phân nếu < 1, không có số thập phân nếu >= 1)
  const displayBalance = suiBalance < 1 
    ? suiBalance.toFixed(2) 
    : suiBalance.toFixed(2).replace(/\.?0+$/, "");

  return {
    balance: suiBalance,
    formattedBalance,
    displayBalance,
    isLoading,
    isError,
    refetch,
  };
}


