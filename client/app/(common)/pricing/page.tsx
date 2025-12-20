"use client";

import PricingHero from "@/components/pages/pricing/PricingHero";
import PricingContent from "@/components/pages/pricing/PricingContent";
import PricingFooter from "@/components/pages/pricing/PricingFooter";
import { pricingData } from "@/components/pages/pricing/Data";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen font-pixel bg-zinc-950 text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-225 h-225 rounded-full bg-red-900/10 blur-[180px]" />
        <div className="absolute bottom-[-30%] right-[-10%] w-175 h-175 rounded-full bg-purple-900/10 blur-[200px]" />
      </div>

      {/* Hero */}
      <div className="relative pt-32 pb-16 px-4 text-center">
        <PricingHero />
      </div>

      {/* Divider */}
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="h-px w-full bg-linear-to-r from-transparent via-red-500/30 to-transparent" />
      </div>

      {/* Content */}
      <section className="relative max-w-5xl mx-auto space-y-24 px-4 py-20">
        {pricingData.map((section) => (
          <div
            key={section.id}
            className="relative rounded-2xl border border-zinc-800/70 bg-zinc-950/60 backdrop-blur-sm p-8 shadow-[0_0_60px_-20px_rgba(255,0,0,0.15)]"
          >
            <PricingContent
              id={section.id}
              title={section.title}
              description={section.description}
              tables={section.tables}
            />
          </div>
        ))}
      </section>

      {/* Footer */}
      <div className="relative mt-24 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 h-px w-full bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
          <PricingFooter />
        </div>
      </div>
    </main>
  );
}
