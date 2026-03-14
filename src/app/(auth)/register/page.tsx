"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("名前を入力してください");
      return;
    }
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!password) {
      setError("パスワードを入力してください");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "アカウント作成に失敗しました");
        return;
      }

      router.push("/login");
    } catch {
      setError("アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#2D3E50]">
            <span className="text-[#FF7A59]">Hub</span>Spot CRM
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            新しいアカウントを作成
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#FF7A59] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#FF7A59] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#FF7A59] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#FF7A59] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#FF7A59] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e8694a] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "作成中..." : "アカウント作成"}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          既にアカウントをお持ちですか？{" "}
          <Link
            href="/login"
            className="font-medium text-[#FF7A59] hover:underline"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
