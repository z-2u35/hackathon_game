import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import PublicSetup from "@/components/layouts/public/PublicSetup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin","latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin","latin-ext"],
});
export const metadata: Metadata = {
  title: "Asteros",
  description: "MainPage",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PublicSetup>{children}</PublicSetup>
      </body>
    </html>
  );
}
