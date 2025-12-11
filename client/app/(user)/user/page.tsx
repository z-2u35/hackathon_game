"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "@/app/providers/networkConfig";

import UserSidebar from "@/components/pages/user/UserSidebar";
import UserMainContent from "@/components/pages/user/UserMainContent";

export default function UserPage() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  // FIX: fallback để không bao giờ undefined => tránh TS lỗi
  const { data: lanternData = { data: [] } } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: `${packageId}::lantern::Lantern` },
      options: { showContent: true },
    },
    { enabled: !!account }
  );

  if (!account) return null;

  const owned = lanternData.data ?? [];
  const hasLantern = owned.length > 0;

  return (
    <div className="min-h-screen pixel-text w-full flex bg-zinc-950 text-white font-pixel">
      <UserSidebar hasLantern={hasLantern} />
      <UserMainContent />
   
    </div>
  );
}
