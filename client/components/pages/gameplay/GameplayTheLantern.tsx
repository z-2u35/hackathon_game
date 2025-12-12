"use client";

export default function TheLantern() {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">🕯️ 5. Ngọn Đèn – Người Dẫn Đường Không Đáng Tin</h2>
      <p className="mb-4">
        Ngọn Đèn vừa giúp bạn sống sót – vừa đẩy bạn đến bờ vực điên loạn.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-700/80 p-4 rounded-lg border border-amber-300/30">
          <strong>Sanity cao:</strong> “Cẩn thận. Đằng kia có bẫy.”
        </div>
        <div className="bg-zinc-700/80 p-4 rounded-lg border border-amber-300/30">
          <strong>Sanity thấp:</strong> “Đi tiếp đi… chết cũng không sao.”
        </div>
      </div>
    </div>
  );
}
