"use client";

import UserHeroSection from "./UserHeroSection";
import ProgressOverview from "./UserProgressOverview";
import TasksSection from "./UserTasksSection";
import LoreSection from "./UserLoreSection";
import TipsSection from "./UserTipsSection";
import NewsSection from "./UserNewsSection";
import CommunitySection from "./UserCommunitySection";

export default function UserMainContent() {
  const hasLantern = true;

  return (
    <main className="flex-1 flex flex-col items-center mt-32 px-4 space-y-8">
      {/* Hero */}
      <section className="w-full max-w-5xl flex justify-center">
        <UserHeroSection />
      </section>

      {/* Progress + Tasks */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        <ProgressOverview hasLantern={hasLantern} />
        <TasksSection />
      </section>

      {/* Lore + Tips */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
        <LoreSection />
        <TipsSection />
      </section>

      {/* News + Community */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        <NewsSection />
        <CommunitySection />
      </section>
    </main>
  );
}
