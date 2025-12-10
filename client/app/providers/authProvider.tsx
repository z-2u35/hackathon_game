/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const account = useCurrentAccount();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Nếu account === null → chưa login → redirect
    if (account === null) {
      router.replace("/auth");
    } else if (account !== undefined) {
      setInitialized(true); // đã login → render content
    }
  }, [account, router]);

  // Khi account đang load hoặc chưa login → không render gì
  if (!initialized) return null;

  return <>{children}</>;
}
