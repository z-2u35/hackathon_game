"use client";

import LoadBackground from "@/components/layouts/user/background/LoadBackground";
import { ReactNode, useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const account = useCurrentAccount();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (account === undefined) return; // SDK đang load
    if (account !== null) {
      // Hoãn setState để tránh cảnh báo ESLint
      const id = setTimeout(() => setInitialized(true), 0);
      return () => clearTimeout(id);
    }
  }, [account]);

  if (account === undefined || !initialized) {
    return <LoadBackground />;
  }

  return <>{children}</>;
}
