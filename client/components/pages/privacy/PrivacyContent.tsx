"use client";

import { useState } from "react";

// components/pages/privacy/PrivacySection.tsx
type Props = {
  id: string;
  title: string;
  items: {
    title: string;
    contents: string[];
  }[];
};

export default function PrivacyContent({ id, title, items }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <section
      id={id}
      className="max-w-4xl mx-auto px-2 m-3 border-b-2 bg-amber-100/50 border-b-amber-100 scroll-mt-28"
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-xl font-semibold text-amber-300">
          {title}
        </h2>

        <span
          className={`ml-4 text-amber-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="mt-4 space-y-4 border-l border-amber-400/20 pl-4">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="font-semibold text-zinc-100">
                {item.title}
              </h3>

              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                {item.contents.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
