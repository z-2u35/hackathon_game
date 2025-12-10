"use client";

import Link from "next/link";
import { Transition } from "@headlessui/react";

export default function AuthBackLink() {
  return (
    <div className="mt-6 pt-6 border-t border-zinc-800 w-full text-center">
      <Transition
        appear
        show={true}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
      >
        <Link
          href="/"
          className="font-body text-zinc-500 hover:text-[#D4A94E] transition-colors text-lg flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
          Quay lại trang chủ
        </Link>
      </Transition>
    </div>
  );
}
