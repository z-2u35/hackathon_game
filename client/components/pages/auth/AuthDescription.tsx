"use client";

import { Transition } from "@headlessui/react";

export default function AuthDescription() {
  return (
    <Transition
      appear
      show={true}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <p className="font-body text-xl text-zinc-400 mb-6 text-center leading-relaxed">
        Kết nối ví Sui hoặc đăng nhập bằng Google để lưu trữ vật phẩm NFT và đồng bộ tiến trình chơi.
      </p>
    </Transition>
  );
}
