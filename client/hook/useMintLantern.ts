import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";

type MintOptions = {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};

export function useMintLantern() {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { hasGas } = useHasGas();

  const handleMint = (options?: MintOptions) => {
    if (!packageId) {
      alert("Package ID chưa có, không thể mint lantern.");
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
        onSuccess: () => {
          alert("✨ Lantern đã được mint!");
          options?.onSuccess?.();
        },
        onError: (err: unknown) => {
          console.error("Mint thất bại:", err);
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Unknown error";
          alert("Mint thất bại: " + message);
          options?.onError?.(err);
        },
      }
    );
  };

  return { handleMint };
}