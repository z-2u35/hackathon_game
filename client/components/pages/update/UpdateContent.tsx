import { UpdateEntry } from "./Data";

interface UpdateContentProps {
  entry: UpdateEntry;
}

export default function UpdateContent({ entry }: UpdateContentProps) {
  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span className="text-red-400 font-bold">{entry.version}</span>
          <span>{entry.date}</span>
        </div>
        <h2 className="text-2xl text-zinc-100 tracking-wide">
          {entry.title}
        </h2>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {entry.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-lg text-red-400">
              {section.heading}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
