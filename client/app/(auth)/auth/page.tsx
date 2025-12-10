"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthTitleSection from "@/components/pages/auth/AuthTitleSection";
import AuthDescription from "@/components/pages/auth/AuthDescription";
import AuthLoginArea from "@/components/pages/auth/AuthLoginArea";
import AuthBackLink from "@/components/pages/auth/AuthBackLink";
import AuthBackground from "@/components/pages/auth/AuthBackground";

export default function AuthPage() {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        router.push("/user");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [account, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <AuthBackground />

      <div className="z-10 flex flex-col items-center gap-8 border-4 border-zinc-800 bg-zinc-900/90 p-12 rounded-xl backdrop-blur-md shadow-[0_0_50px_rgba(212,169,78,0.15)] max-w-lg w-full">
        <AuthTitleSection />
        <AuthDescription />
        <AuthLoginArea account={account} />
        <AuthBackLink />
      </div>
    </div>
  );
}
