"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";

export default function HeroSection() {
  return (
    <section className="relative flex rounded-2xl flex-col items-center border-2 border-amber-100/20 justify-center h-auto bg-linear-to-b from-zinc-900 via-zinc-950 to-black text-white overflow-hidden px-4 py-16">
      
      {/* Decorative background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Title */}
      <Transition
        as={Fragment}
        appear
        show={true}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0 -translate-y-10"
        enterTo="opacity-100 translate-y-0"
      >
        <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold mb-4 text-center">
          THE LOST LANTERN – GIỚI THIỆU
        </h1>
      </Transition>

      {/* Subtitle */}
      <Transition
        as={Fragment}
        appear
        show={true}
        enter="transition-opacity delay-300 duration-1000"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
      >
        <p className="text-[clamp(1rem,3vw,1.25rem)] italic text-center max-w-2xl">
          &ldquo;Nơi ánh sáng không cứu rỗi… mà chỉ khiến sự thật hiện hình.&rdquo;
        </p>
      </Transition>
    </section>
  );
}
