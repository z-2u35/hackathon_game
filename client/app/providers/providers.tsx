"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { registerEnokiWallets } from "@mysten/enoki"; // Tạm thời disable
import { networkConfig } from "./networkConfig";
import { useEffect } from "react";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

// Component để đăng ký Enoki wallets
// Enoki API key cần được cấu hình trong .env.local: NEXT_PUBLIC_ENOKI_API_KEY=your_api_key
// Bạn có thể lấy API key tại https://enoki.com
// TẠM THỜI DISABLE để tránh lỗi - cần config đúng với client và providers trước khi enable
function EnokiWalletRegistration() {
  // Tạm thời disable Enoki để tránh lỗi
  // TODO: Cần config đúng với SuiClient và providers options trước khi enable
  /*
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ENOKI_API_KEY;
    
    if (!apiKey) {
      console.warn("Enoki API key không được cấu hình. Ví tàng hình sẽ không hoạt động.");
      return;
    }

    try {
      // Đăng ký Enoki wallets với các providers (Google, Facebook, Twitch, etc.)
      // Khi người dùng click ConnectButton, popup slush sẽ hiện lên với các options đăng nhập
      const result = registerEnokiWallets({
        apiKey: apiKey,
        providers: ["google", "facebook", "twitch"], // Các providers bạn muốn hỗ trợ
        windowFeatures: "width=500,height=600,left=100,top=100", // Kích thước popup slush
      });

      // Kiểm tra kết quả trước khi sử dụng
      if (!result || typeof result !== "object" || !result.unregister) {
        console.warn("registerEnokiWallets không trả về đúng định dạng");
        return;
      }

      const { unregister } = result;

      // Cleanup khi component unmount
      return () => {
        if (typeof unregister === "function") {
          unregister();
        }
      };
    } catch (error) {
      console.error("Lỗi khi đăng ký Enoki wallets:", error);
    }
  }, []);
  */

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const defaultNetwork =
    (process.env.NEXT_PUBLIC_SUI_NETWORK as "devnet" | "testnet" | "mainnet") ||
    "testnet";

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={defaultNetwork}>
        <WalletProvider autoConnect>
          <EnokiWalletRegistration />
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}