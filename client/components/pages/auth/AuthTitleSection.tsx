"use client";

import { Transition } from "@headlessui/react";

export default function AuthTitleSection() {
  return (
    <Transition
      appear
      show={true}
      enter="transition-transform duration-500"
      enterFrom="translate-y-4 opacity-0"
      enterTo="translate-y-0 opacity-100"
    >
      <div className="text-center">
        <h1 className="font-pixel text-4xl text-[#D4A94E] mb-4 tracking-widest drop-shadow-md">
          LOGIN SYSTEM
        </h1>
        <div className="h-1 w-24 bg-[#D4A94E] mx-auto rounded-full mb-6" />
      </div>
    </Transition>
  );
}
