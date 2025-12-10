/* eslint-disable react-hooks/set-state-in-effect */
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
    if (account === undefined) return; // Đang load SDK

    if (account === null) {
      // Có wallet nhưng chưa connect → redirect
      window.location.replace("/auth");
      return;
    }

    // Có account → đã login
    setInitialized(true);
  }, [account]);

  // account undefined → F5 hoặc SDK đang load → hiển thị nền load
  if (account === undefined) {
    return <LoadBackground />;
  }

  // account null nhưng redirect chưa chạy → tránh render trắng
  if (account === null) {
    return <LoadBackground />;
  }

  // account đã có nhưng chưa init logic → show background
  if (!initialized) {
    return <LoadBackground />;
  }

  return <>{children}</>;
}
