"use client";

import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl font-bold text-[#1f1f1f]/10">404</div>
        <h1 className="mb-2 text-xl font-semibold text-[#1f1f1f]">
          ページが見つかりません
        </h1>
        <p className="mb-6 text-sm text-[rgba(0,0,0,0.62)]">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/contacts"
          className="inline-flex items-center rounded-[8px] bg-[#ff4800] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c93700]"
        >
          コンタクトに戻る
        </Link>
      </div>
    </div>
  );
}
