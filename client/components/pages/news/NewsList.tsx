"use client";

import { newsData } from "./NewsData";

export default function NewsList() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {newsData.map((news, idx) => (
        <div
          key={idx}
          className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/70 hover:border-amber-600 transition"
        >
          <div className="flex flex-wrap gap-3 items-center mb-2">
            <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full font-pixel text-amber-400">
              {news.tag}
            </span>
            <span className="text-xs text-zinc-500 font-pixel">
              {news.date}
            </span>
          </div>

          <h3 className="text-xl font-pixel text-zinc-100 mb-3">
            {news.title}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {news.summary}
          </p>

          <button className="px-4 py-2 border border-zinc-700 rounded hover:border-amber-500 hover:text-amber-400 transition font-pixel text-sm">
            {news.action}
          </button>
        </div>
      ))}
    </section>
  );
}
