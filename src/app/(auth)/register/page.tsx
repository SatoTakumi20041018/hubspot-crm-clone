"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName) {
      setError("名前を入力してください");
      return;
    }
    if (!lastName) {
      setError("姓を入力してください");
      return;
    }
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!companyName) {
      setError("会社名を入力してください");
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
    if (!agreeToTerms) {
      setError("利用規約に同意してください");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${lastName} ${firstName}`,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "アカウント作成に失敗しました");
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
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4800]">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">
            <span className="text-[#ff4800]">Hub</span>Spot
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

        {/* Google Register Button */}
        <button
          type="button"
          className="mb-5 flex w-full items-center justify-center gap-3 rounded-[8px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Googleで登録
        </button>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">または</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row: firstName + lastName */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                名前
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="太郎"
                className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                姓
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="山田"
                className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
              />
            </div>
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
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            />
          </div>

          <div>
            <label
              htmlFor="companyName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              会社名
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="株式会社サンプル"
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            />
          </div>

          {/* C3: Company size dropdown */}
          <div>
            <label
              htmlFor="companySize"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              会社規模
            </label>
            <select
              id="companySize"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            >
              <option value="">選択してください</option>
              <option value="1-10">1〜10名</option>
              <option value="11-50">11〜50名</option>
              <option value="51-200">51〜200名</option>
              <option value="201-500">201〜500名</option>
              <option value="500+">500名以上</option>
            </select>
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
              className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
            />
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#ff4800] focus:ring-[#ff4800]"
            />
            <span>
              <span className="text-[#ff4800] hover:underline cursor-pointer">
                利用規約
              </span>
              に同意する
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-[8px] bg-[#ff4800] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93700] active:bg-[#9f2800] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "作成中..." : "アカウント作成"}
          </button>
        </form>

        {/* C4: More prominent login link */}
        <div className="mt-6 rounded-lg border border-[rgba(0,0,0,0.11)] bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-700">
            すでにアカウントをお持ちですか？
          </p>
          <Link
            href="/login"
            className="mt-1 inline-block text-sm font-semibold text-[#ff4800] hover:underline"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
