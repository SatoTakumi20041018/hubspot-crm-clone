"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfcfa]">
      <div className="text-center">
        <div className="mb-6 text-6xl font-bold text-[#1f1f1f]/10">404</div>
        <h1 className="mb-2 text-2xl font-semibold text-[#1f1f1f]">
          ページが見つかりません
        </h1>
        <p className="mb-8 text-[rgba(0,0,0,0.62)]">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/contacts"
          className="inline-flex items-center rounded-[8px] bg-[#ff4800] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c93700]"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
