import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

type MintOptions = {
  onSuccess?: () => void; // Callback sau khi mint thành công
  onError?: (error: string) => void; // Callback khi mint thất bại
};

export function useMintLantern() {
  const packageId = useNetworkVariable("packageId"); // Lấy packageId động
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMint = (options?: MintOptions) => {
    if (!packageId) {
      const errorMsg = "Package ID chưa có, không thể mint lantern.";
      alert(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::lantern::new_game`, // Gọi entry new_game
      arguments: [], // Không cần argument
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
