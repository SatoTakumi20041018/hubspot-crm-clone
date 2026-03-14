"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1f1f1f]">
            <span className="text-[#ff4800]">Hub</span>Spot CRM
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            アカウントにログイン
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
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#1f1f1f]"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-[8px] bg-[#ff4800] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93700] active:bg-[#9f2800] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          アカウントをお持ちでないですか？{" "}
          <Link
            href="/register"
            className="font-medium text-[#ff4800] hover:underline"
          >
            アカウントを作成
          </Link>
        </div>
      </div>
    </div>
  );
}
