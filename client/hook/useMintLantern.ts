import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";
import { useHasGas } from "@/hook/useHasGas";

type MintOptions = {
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export function useMintLantern() {
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { hasGas } = useHasGas();

  const handleMint = (options?: MintOptions) => {
    // Check packageId
    if (!packageId || packageId.length < 10) {
      const errorMsg = "Package ID không hợp lệ. Vui lòng kiểm tra cấu hình network.";
      console.error("Invalid packageId:", packageId);
      alert(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    // Check gas
    if (!hasGas) {
      const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
      const errorMsg = `Ví của bạn không có SUI để trả gas trên ${network}. Hãy faucet SUI rồi thử lại.`;
      alert(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::lantern::new_game`,
        arguments: [],
      });

      console.log("Executing mint transaction with packageId:", packageId);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Mint thành công:", result);
            alert("✨ Lantern đã được mint!");
            options?.onSuccess?.();
          },
          onError: (err: unknown) => {
            console.error("Mint thất bại:", err);
            const message =
              err && typeof err === "object" && "message" in err
                ? (err as { message: string }).message
                : err && typeof err === "object" && "cause" in err
                ? String((err as { cause: unknown }).cause)
                : "Unknown error";
            alert("Mint thất bại: " + message);
            options?.onError?.(message);
          },
        }
      );
    } catch (error) {
      console.error("Exception khi tạo transaction:", error);
      const errorMsg = error instanceof Error ? error.message : "Lỗi không xác định khi tạo transaction";
      alert("Lỗi: " + errorMsg);
      options?.onError?.(errorMsg);
    }
  };

  return { handleMint };
}
