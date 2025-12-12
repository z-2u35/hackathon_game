// components/home/IntroSection.tsx
"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";

export default function IntroSection() {
  return (
    <section className="py-20 px-4 text-center bg-zinc-900 text-zinc-100">
      <h2 className="text-4xl font-bold font-pixel mb-6">
        Một Thành Phố Bị Ánh Sáng Nuốt Chửng
      </h2>
      <p className="max-w-3xl mx-auto mb-4">
        Asteros từng là đế chế rực rỡ dưới lòng đất. Cho đến ngày một Ngọn Đèn
        cổ rơi xuống và phơi bày mọi sự thật kinh hoàng. Giờ đây, bạn — bản thể
        tái sinh thứ 10,492 — phải bước vào chính nơi đã hủy diệt hàng vạn linh
        hồn, tìm ra lý do vì sao Ngọn Đèn chọn bạn… và đối mặt với chính bản ngã
        của mình.
      </p>

      <Disclosure>
        {({}) => (
          <>
            <Disclosure.Button
              as={Link}
              href="/about"
              className="mt-4 font-pixel px-6 py-2 bg-amber-700/40 border border-amber-500 rounded hover:bg-amber-600 transition-all"
            >
              → Khám phá LORE
            </Disclosure.Button>
            <Disclosure.Panel className="mt-2 text-sm text-zinc-400">
              <p>
                The Lost Lantern là sản phẩm đồ án Pixel Art tối giản, phát
                triển bởi team Flash Wolves, sinh viên Trường Đại Học Văn Lang.
              </p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  );
}
