import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";

type MintOptions = {
  onSuccess?: () => void; // Callback sau khi mint thành công
  onError?: (error: string) => void; // Callback khi mint thất bại
};

export function useMintLantern() {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { hasGas } = useHasGas();

  const handleMint = (options?: MintOptions) => {
    if (!packageId) {
      const errorMsg = "Package ID chưa có, không thể mint lantern.";
      alert(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    if (!hasGas) {
      const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
      alert(`Ví của bạn không có SUI để trả gas trên ${network}. Hãy faucet SUI (đúng network) rồi thử lại.`);
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::lantern::new_game`,
      arguments: [],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("Mint thành công:", result);
          alert("✨ Lantern đã được mint!");
          options?.onSuccess?.(); // Gọi callback để refetch data
        },
        onError: (err: unknown) => {
          console.error("Mint thất bại:", err);
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Unknown error";
          alert("Mint thất bại: " + message);
          options?.onError?.(message);
        },
      }
    );
  };

  return { handleMint };
}