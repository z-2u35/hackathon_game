"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import Link from "next/link";
import StartGameButton from "@/components/game/StartGameButton";
import GameHUD from "@/components/game/GameHUD";
import GameActions from "@/components/game/GameActions"; 
import { useNetworkVariable } from "@/app/networkConfig";

export default function Home() {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  // --- LOGIC KIỂM TRA: User đã có đèn (nhân vật) chưa? ---
  // Chúng ta gọi trực tiếp useSuiClientQuery tại đây thay vì import hàm lạ
  const { data: lanternData, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: `${packageId}::lantern::Lantern` },
      options: { showContent: true }
    },
    { enabled: !!account }
  );

  // Kiểm tra xem mảng dữ liệu trả về có phần tử nào không
  const hasLantern = lanternData && lanternData.data && lanternData.data.length > 0;
  
  // Lấy ID của chiếc đèn (nếu có) để truyền xuống cho GameActions
  const lanternId = hasLantern ? lanternData.data[0].data?.objectId : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black z-0"></div>

      <div className="z-10 text-center flex flex-col items-center gap-6 w-full px-4 py-12">
        <h1 className="text-5xl md:text-8xl font-pixel font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-700 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          ASTEROS
        </h1>
        
        {account ? (
          <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {hasLantern && lanternId ? (
              // CASE 1: ĐÃ CÓ NHÂN VẬT -> HIỆN HUD + ACTIONS
              <div className="flex flex-col items-center gap-6 w-full">
                
                {/* HUD hiển thị chỉ số */}
                <GameHUD />

                {/* Khu vực hành động (Di chuyển) */}
                <GameActions 
                  lanternId={lanternId} 
                  onSuccess={() => {
                    // Khi hành động xong, gọi refetch để cập nhật lại HUD ngay lập tức
                    setTimeout(() => refetch(), 1000); 
                  }} 
                />

              </div>
            ) : (
              // CASE 2: CHƯA CÓ NHÂN VẬT -> HIỆN NÚT MINT
              <div className="mt-8 flex flex-col items-center">
                <StartGameButton />
                <button 
                  onClick={() => refetch()} 
                  className="mt-6 text-xs text-zinc-500 hover:text-white underline font-mono"
                >
                  ⟳ Làm mới dữ liệu
                </button>
              </div>
            )}
            
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 mt-10">
            <p className="text-zinc-500 font-body text-xl">Kết nối ví để bước vào hầm ngục...</p>
            <Link
              href="/auth"
              className="font-pixel text-sm bg-[#D4A94E] text-black py-4 px-10 rounded border-b-4 border-[#b45309] hover:bg-[#fbbf24] active:translate-y-1 transition-all"
            >
              LOGIN SYSTEM
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}