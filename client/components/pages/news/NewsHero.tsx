"use client";

export default function NewsHero() {
  return (
    <section className="relative h-80 mt-4 flex items-center justify-center overflow-hidden border-b border-zinc-800">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/news/hero.jpg')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-pixel text-amber-400 mb-4">
          🕯️ Tin Tức & Cập Nhật Từ Asteros
        </h1>
        <p className="text-zinc-300 max-w-xl mx-auto font-pixel text-sm md:text-base">
          “Tàn dư ký ức từ một thế giới bị bóng tối nuốt chửng.”
        </p>
      </div>
    </section>
  );
}
