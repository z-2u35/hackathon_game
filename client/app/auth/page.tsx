"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const account = useCurrentAccount();
  const router = useRouter();

  // Nếu đăng nhập thành công -> Tự động chuyển về trang chủ sau 1.5 giây
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [account, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black z-0" />
      
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

      <div className="z-10 flex flex-col items-center gap-8 border-4 border-zinc-800 bg-zinc-900/90 p-12 rounded-xl backdrop-blur-md shadow-[0_0_50px_rgba(212,169,78,0.15)] max-w-lg w-full">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-pixel text-4xl text-[#D4A94E] mb-4 tracking-widest drop-shadow-md">
            LOGIN SYSTEM
          </h1>
          <div className="h-1 w-24 bg-[#D4A94E] mx-auto rounded-full mb-6" />
        </div>

        <p className="font-body text-xl text-zinc-400 mb-6 text-center leading-relaxed">
          Kết nối ví Sui hoặc đăng nhập bằng Google để lưu trữ vật phẩm NFT và đồng bộ tiến trình chơi.
        </p>

        {/* Login Area */}
        <div className="w-full flex justify-center py-4">
          {account ? (
            // TRẠNG THÁI: ĐĂNG NHẬP THÀNH CÔNG
            <div className="flex flex-col items-center animate-pulse">
              <div className="text-green-400 font-pixel text-2xl mb-4 border-2 border-green-500 px-6 py-3 rounded bg-green-900/20">
                SUCCESS!
              </div>
              <p className="text-zinc-500 font-body text-lg">
                Đang chuyển hướng...
              </p>
            </div>
          ) : (
            // TRẠNG THÁI: CHƯA ĐĂNG NHẬP
            <div className="scale-125 custom-connect-wrapper transition-transform hover:scale-130">
              <ConnectButton connectText="Login with Wallet / Google" />
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-zinc-800 w-full text-center">
          <Link href="/" className="font-body text-zinc-500 hover:text-[#D4A94E] transition-colors text-lg flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> 
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}