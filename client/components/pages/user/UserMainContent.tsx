"use client";

import UserHeroSection from "./UserHeroSection";
import ProgressOverview from "./UserProgressOverview";
import TasksSection from "./UserTasksSection";
import LoreSection from "./UserLoreSection";
import TipsSection from "./UserTipsSection";
import NewsSection from "./UserNewsSection";
import CommunitySection from "./UserCommunitySection";
import { usePlayerStats } from "@/hook/usePlayerStats";

export default function UserMainContent() {
  const { hasLantern } = usePlayerStats();

  return (
    <main className="flex-1 flex flex-col items-center mt-32 px-4 space-y-5">
      {/* Hero Section */}
      <section className="w-full max-w-5xl">
        <UserHeroSection />
      </section>

      {/* Progress + Tasks (2 cột trên desktop, 1 cột trên mobile) */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5">
        <ProgressOverview hasLantern={hasLantern} />
        <TasksSection />
      </section>

      {/* Lore + Tips (2 cột) */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-9">
        <LoreSection />
        <TipsSection />
      </section>

      {/* News + Community (2 cột) */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5">
        <NewsSection />
        <CommunitySection />
      </section>
    </main>
  );
}
