import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

export function useMintLantern() {
  const packageId = useNetworkVariable("packageId"); // Lấy packageId động
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMint = () => {
    if (!packageId) {
      alert("Package ID chưa có, không thể mint lantern.");
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
        onSuccess: () => {
          alert("✨ Lantern đã được mint!");
          // Nếu muốn, bạn có thể refetch lại HUD
        },
        onError: (err: unknown) => {
          console.error("Mint thất bại:", err);
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Unknown error";
          alert("Mint thất bại: " + message);
        },
      }
    );
  };

  return { handleMint };
}
