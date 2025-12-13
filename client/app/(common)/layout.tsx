"use client";

import React from "react";
import dynamic from "next/dynamic";

// Chỉ mount PublicSetup trên client, SSR bỏ qua
const CommonSetupClient = dynamic(
  () => import("@/components/layouts/common/CommonSetup"),
  { ssr: false }
);

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <CommonSetupClient>{children}</CommonSetupClient>
    </>
  );
}
