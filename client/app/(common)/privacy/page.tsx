"use client";

import PrivacyHero from "@/components/pages/privacy/PrivacyHero";
import PrivacyContent from "@/components/pages/privacy/PrivacyContent";
import PrivacyFooter from "@/components/pages/privacy/PrivacyFooter";
import { privacyData } from "@/components/pages/privacy/Data";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen scale-[1.3] font-pixel mt-30 bg-zinc-950 text-white">
      {/* Hero */}
      <div className="pt-24 pb-10 px-3">
        <PrivacyHero />
      </div>

      {/* Content */}
      <section className="max-w-5xl mx-auto space-y-14 px-3">
        {privacyData.map((section) => (
          <PrivacyContent
            key={section.id}
            id={section.id}
            title={section.title}
            items={section.items}
          />
        ))}
      </section>

      {/* Footer */}
      <div className="mt-20 px-3 pb-10">
        <PrivacyFooter />
      </div>
    </main>
  );
}
