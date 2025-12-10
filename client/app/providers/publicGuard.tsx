// providers/PublicGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface PublicGuardProps {
  children: ReactNode;
  redirectTo?: string; // Trang redirect nếu đã login
}

export default function PublicGuard({ children, redirectTo = "/user" }: PublicGuardProps) {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      // Nếu đã login, redirect về trang user
      router.replace(redirectTo);
    }
  }, [account, router, redirectTo]);

  // Chỉ render children khi chưa login
  if (account) return null;

  return <>{children}</>;
}
