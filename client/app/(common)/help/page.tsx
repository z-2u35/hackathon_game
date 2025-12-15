"use client";

import { useState } from "react";
import HelpHero from "@/components/pages/help/HelpHero";
import HelpSection from "@/components/pages/help/HelpSection";
import HelpFooter from "@/components/pages/help/HelpFooter";
import {
  gameplayData,
  web3Data,
  supportData,
} from "@/components/pages/help/helpData";

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <main className="min-h-screen font-pixel p-3 bg-zinc-950 text-white">
      <HelpHero />

      <HelpSection
        id="gameplay"
        title="I. CƠ CHẾ SINH TỒN & TÂM LÝ"
        openSection={openSection}
        setOpenSection={setOpenSection}
        items={gameplayData}
      />

      <HelpSection
        id="web3"
        title="II. HỆ THỐNG WEB3 & KINH TẾ"
        openSection={openSection}
        setOpenSection={setOpenSection}
        items={web3Data}
      />

      <HelpSection
        id="support"
        title="III. HỖ TRỢ KỸ THUẬT & BÁO CÁO LỖI"
        openSection={openSection}
        setOpenSection={setOpenSection}
        items={supportData}
      />

      <HelpFooter />
    </main>
  );
}
