export default function PrivacyHero() {
  return (
    <section className="relative text-center">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="py-10 px-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-amber-400">
          🛡️ CHÍNH SÁCH BẢO MẬT
        </h1>

        <div className="mt-4 mx-auto h-px w-32 bg-linear-to-r from-transparent via-amber-400/60 to-transparent" />

        <p className="mt-4 text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Sự thật đằng sau dữ liệu trong thế giới <span className="text-amber-300">The Lantern Paradox</span>.
          Ánh sáng không phơi bày những bí mật mà bạn chọn giữ lại.
        </p>
      </div>
    </section>
  );
}
