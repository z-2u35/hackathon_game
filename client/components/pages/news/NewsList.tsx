"use client";

import Link from "next/link";
import { newsData } from "./NewsData";
import FantasyPixiBackground from "@/components/layouts/common/Background/FantasyPixiBackground";

export default function NewsList({ activeFilter }: { activeFilter: string }) {
  const filteredNews =
    activeFilter === "Tất cả"
      ? newsData
      : newsData.filter((n) => n.tag === activeFilter);

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-14">
      {/* PIXI BACKGROUND */}
      <FantasyPixiBackground />

      {/* CONTENT */}
      <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((news, idx) => (
          <article
            key={`${news.title}-${idx}`}
            className="group relative rounded-2xl border border-zinc-800
                       bg-zinc-900/70 backdrop-blur
                       transition-all duration-300
                       hover:-translate-y-1 hover:border-amber-500
                       animate-fadeInUp overflow-hidden"
          >
            {/* glow overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.12),transparent_60%)]" />
            </div>

            <div className="relative p-6 flex flex-col h-full">
              <div className="flex gap-3 items-center mb-3">
                <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full font-pixel text-amber-400">
                  {news.tag}
                </span>
                <span className="text-xs text-zinc-500 font-pixel">
                  {news.date}
                </span>
              </div>

              <h3 className="text-lg font-pixel text-zinc-100 mb-3">
                {news.title}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-4">
                {news.summary}
              </p>

              <Link
                href={news.href}
                className="mt-auto inline-flex items-center gap-2
                           px-4 py-2 border border-zinc-700 rounded-md
                           font-pixel text-sm transition
                           group-hover:border-amber-500 group-hover:text-amber-400"
              >
                {news.action}
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
