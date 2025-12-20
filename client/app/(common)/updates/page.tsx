"use client";

import UpdateHero from "@/components/pages/update/UpdateHero";
import UpdateContent from "@/components/pages/update/UpdateContent";
import UpdateFooter from "@/components/pages/update/UpdateFooter";
import { updateData } from "@/components/pages/update/Data";

export default function UpdatePage() {
  return (
    <main className="relative min-h-screen font-pixel bg-zinc-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-200 h-200 rounded-full bg-red-900/10 blur-[180px]" />
      </div>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4">
        <UpdateHero />
      </div>

      {/* Content */}
      <section className="relative max-w-4xl mx-auto space-y-24 px-4 pb-24">
        {updateData.map((entry) => (
          <div
            key={entry.version}
            className="rounded-2xl border border-zinc-800/70 bg-zinc-950/60 backdrop-blur-sm p-8 shadow-[0_0_60px_-25px_rgba(255,0,0,0.15)]"
          >
            <UpdateContent entry={entry} />
          </div>
        ))}
      </section>

      {/* Footer */}
      <div className="relative px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 h-px w-full bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
          <UpdateFooter />
        </div>
      </div>
    </main>
  );
}
