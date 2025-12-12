"use client";

import React from "react";
import dynamic from "next/dynamic";
import PublicGuard from "../providers/publicGuard";

// Chỉ mount PublicSetup trên client, SSR bỏ qua
const PublicSetupClient = dynamic(
  () => import("@/components/layouts/public/PublicSetup"),
  { ssr: false }
);

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <PublicGuard>
      <PublicSetupClient>{children}</PublicSetupClient>
    </PublicGuard>
  );
}
