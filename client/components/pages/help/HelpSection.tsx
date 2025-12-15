type Item = {
  question: string;
  answer: string;
};

export default function HelpSection({
  id,
  title,
  items,
  openSection,
  setOpenSection,
}: {
  id: string;
  title: string;
  items: Item[];
  openSection: string | null;
  setOpenSection: (v: string | null) => void;
}) {
  const isOpen = openSection === id;

  return (
    <section className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => setOpenSection(isOpen ? null : id)}
        className="w-full text-left text-2xl text-amber-300 border-b border-zinc-700 pb-2 mb-4"
      >
        {title} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="space-y-4 animate-fadeInUp ">
          {items.map((it, i) => (
            <div
              key={i}
              className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg text-zinc-100 mb-2">
                {it.question}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {it.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
