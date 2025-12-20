import { JSX } from "react";

interface Table {
  headers: string[];
  rows: (string | JSX.Element)[][];
}

interface PricingContentProps {
  id: string;
  title: string;
  description?: string;
  tables: Table[];
}

const rarityClassMap: Record<string, string> = {
  Common: "text-zinc-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-yellow-400",
  Cursed: "text-red-500 font-bold",
};

export default function PricingContent({
  id,
  title,
  description,
  tables,
}: PricingContentProps) {
  return (
    <section id={id} className="space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <h3 className="text-2xl text-red-400 tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Tables */}
      {tables.map((table, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-zinc-800 text-sm">
            <thead className="bg-zinc-900">
              <tr>
                {table.headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-zinc-300 border-b border-zinc-800"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {table.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="odd:bg-zinc-950 even:bg-zinc-900/50"
                >
                  {row.map((cell, cIdx) => {
                    const isString = typeof cell === "string";
                    const rarityClass = isString
                      ? rarityClassMap[cell] ?? "text-zinc-400"
                      : "text-zinc-400";

                    return (
                      <td
                        key={cIdx}
                        className={`px-4 py-3 border-b border-zinc-800 align-top ${rarityClass}`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
