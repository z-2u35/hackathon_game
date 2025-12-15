export default function HelpHero() {
  return (
    <section className="relative max-w-6xl mt-20 mx-auto px-4 py-16 text-center overflow-hidden">
      {/* Glow nền mờ */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-amber-900/10 via-transparent to-transparent" />

      {/* Title */}
      <h1
        className="text-4xl md:text-6xl mb-6 text-amber-400 font-pixel tracking-wide"
        style={{
          textShadow:
            "3px 3px 0 #3b2a00, -3px -3px 0 #3b2a00, 3px -3px 0 #3b2a00, -3px 3px 0 #3b2a00",
        }}
      >
        🕯️ HELP & SURVIVAL LOG
      </h1>

      {/* Divider pixel */}
      <div className="mx-auto mb-6 h-0.5 w-40 bg-linear-to-r from-transparent via-amber-500 to-transparent" />

      {/* Description */}
      <p className="max-w-3xl mx-auto text-zinc-400 leading-relaxed text-base md:text-lg">
        Vòng lặp của <span className="text-zinc-200">Asteros</span> không khoan
        nhượng. Khi hệ thống phản bội bạn, khi ký ức vỡ vụn, hoặc khi bóng tối
        nuốt trọn lý trí —
        <br />
        <span className="text-amber-400">
          nơi này tồn tại để giúp bạn sống sót thêm một lần nữa.
        </span>
      </p>

      {/* Quote */}
      <div className="mt-8 text-sm md:text-base text-zinc-500 italic">
        “Sự thật không bao giờ biến mất.
        <br />
        Nó chỉ chờ bạn đủ tuyệt vọng để nhìn thấy.”
      </div>
    </section>
  );
}
