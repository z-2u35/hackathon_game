"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function GamePage() {
  const search = useSearchParams();
  const tx = search?.get("tx");
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="max-w-xl w-full border-4 border-zinc-800 bg-zinc-900/90 p-8 rounded-xl text-center">
        <h1 className="font-pixel text-4xl text-amber-400 mb-4">Welcome to Asteros</h1>
        <p className="mb-4">Bạn đã tạo nhân vật thành công. Đây là trang chơi tạm thời.</p>

        {account && (
          <div className="mb-4 text-zinc-400">Ví: {account.address}</div>
        )}

        {tx ? (
          <div className="mb-6">
            <div className="font-body text-sm text-zinc-400 mb-2">Transaction</div>
            <pre className="text-xs bg-black/60 p-3 break-words rounded">{tx}</pre>
          </div>
        ) : (
          <div className="mb-6 text-zinc-500">Không có transaction digest để hiển thị.</div>
        )}

        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 bg-amber-600 rounded font-pixel">Về trang chủ</Link>
          <Link href="/auth" className="px-4 py-2 bg-zinc-700 rounded font-pixel">Đăng nhập lại</Link>
        </div>
      </div>
    </div>
  );
}
